
import { ThrowError, SaveAuditTrail } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import hasPermission from "../../Helpers/hasPermission.js";
import CONFIG from "../../config/config.js";
import { Validate } from "../../Helpers/Validate.js";

export default {
  Query: {
    async getAllCompanyRoles(_, { company_id, offset }: { company_id: number, offset: number }, context: Record<string, any>) {
      try {
        if (!context.id) {
          ThrowError("#RELOGIN");
        }
        if (!Validate.integer(company_id)) {
          ThrowError("Invalid company_id");
        }
        if (!hasPermission({ context, company_id, tasks: ['VIEW_ALL_ROLES'] })) {
          ThrowError("#NOACCESS");
        }

        const pageSize = CONFIG.settings.PAGINATION_LIMIT || 30;
        const calculatedOffset = offset * pageSize;

        const query = `
          SELECT id, name, description, permissions, created_at, updated_at
          FROM roles
          WHERE company_id = :company_id
          ORDER BY id
          LIMIT :limit OFFSET :offset
        `;

        const params = {
          company_id,
          limit: pageSize,
          offset: calculatedOffset
        };

        return await DBObject.findDirect(query, params);
      } catch (error) {
        ThrowError(error);
      }
    },
  },
  Mutation: {
    async createRole(_, { company_id, name, json }: Record<string, any>, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      if (!hasPermission({ context, company_id, tasks: ['CREATE_ROLE'] })) {
        ThrowError("#NOACCESS");
      }

      try {
        const newRole = {
          company_id,
          name,
          json: JSON.stringify(json),
        };
        const roleId = await DBObject.insertOne("roles", newRole);

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: 'CREATE_ROLE',
          details: `Created role: ${name} for company ${company_id}`
        });

        return await DBObject.findOne("roles", { id: roleId });
      } catch (error) {
        ThrowError(error);
      }
    },


    async updateRole(_, { id, name, json, status }: Record<string, any>, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      if (!Validate.integer(id)) {
        ThrowError("Invalid role id");
      }

      let updatedRole: any = null;
      try {
        const role = await DBObject.findOne("roles", { id });
        if (!role) {
          ThrowError("#ROLE_NOT_FOUND");
        }
        if (!hasPermission({ context, company_id: role.company_id, tasks: ['UPDATE_ROLE'] })) {
          ThrowError("#NOACCESS");
        }
        const updateData = {
          name,
          json: JSON.stringify(json),
          status: status ? 'ACTIVE' : 'BLOCKED',
        };


        await DBObject.updateOne("roles", updateData, { id });

        updatedRole = await DBObject.findOne("roles", { id });

        SaveAuditTrail({
          user_id: context.id,
          company_id: updatedRole.company_id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: 'UPDATE_ROLE',
          details: `Updated role with ID: ${id}`
        });
      } catch (error) {
        ThrowError(error);
      }

      return updatedRole;
    },
    async deleteRole(_, { id }: Record<string, any>, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      try {
        const role = await DBObject.findOne("roles", { id });
        if (!role) {
          ThrowError("#ROLE_NOT_FOUND");
        }
        if (!hasPermission({ context, company_id: role.company_id, tasks: ['DELETE_ROLE'] })) {
          ThrowError("#NOACCESS");
        }
        const deletedId = await DBObject.deleteOne("roles", { id });
        SaveAuditTrail({
          user_id: context.id,
          company_id: role.company_id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: 'DELETE_ROLE',
          details: `Deleted role with ID: ${id}`
        });
        return deletedId;
      } catch (error) {
        ThrowError(error);
      }
    },

  }

};

