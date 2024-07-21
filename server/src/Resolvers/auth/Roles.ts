
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
        if (!Validate.positiveInteger(company_id)) {
          ThrowError("Invalid company");
        }
        if (!hasPermission({ context, company_id, tasks: ['roles'] })) {
          ThrowError("#NOACCESS");
        }

        const pageSize = CONFIG.settings.PAGINATION_LIMIT || 30;
        const calculatedOffset = offset * pageSize;

        const query = `SELECT id, name, description, permissions, created_at, updated_at FROM roles WHERE company_id = :company_id LIMIT :limit OFFSET :offset`;

        const params = { company_id, limit: pageSize, offset: calculatedOffset };

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
      if (!hasPermission({ context, company_id, tasks: ['roles'] })) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid role name");
      }

      if (!Validate.object(json)) {
        ThrowError("Invalid role");
      }

      try {
        const newRole = { company_id, name, json: JSON.stringify(json), };
        const roleId = await DBObject.insertOne("roles", newRole);
        if (!roleId) {
          ThrowError("Failed to create role");
        }
        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
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


    async updateRole(_, { id, company_id, name, json, status }: Record<string, any>, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }


      if (!hasPermission({ context, company_id, tasks: ['roles'] })) {
        ThrowError("#NOACCESS");
      }


      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid role");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.string(status)) {
        ThrowError("Invalid role status");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid role name");
      }

      if (!Validate.object(json)) {
        ThrowError("Invalid role");
      }

      let updatedRole = 0;
      try {
        const updateData = {
          name,
          json: JSON.stringify(json),
          status
        };


        updatedRole = await DBObject.updateOne("roles", updateData, { id });
        if (!Validate.positiveInteger(updatedRole)) {
          ThrowError("Failed to update role");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id: company_id,
          branch_id: 0,
          name: context.name,
          task: 'UPDATE_ROLE',
          details: `Updated role with ID: ${id} to ${JSON.stringify(updateData)}`
        });
      } catch (error) {
        ThrowError(error);
      }

      return await DBObject.findOne("roles", { id });
    },

    async deleteRole(_, { id, company_id }: Record<string, any>, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id: company_id, tasks: ['roles'] })) {
        ThrowError("#NOACCESS");
      }


      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid role");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      try {
        const { name } = await DBObject.findOne("roles", { id }, { columns: 'name' });
        const deleted = await DBObject.deleteOne("roles", { id });
        if (!Validate.positiveInteger(deleted)) {
          ThrowError("Failed to delete role");
        }


        SaveAuditTrail({
          user_id: context.id,
          company_id: company_id,
          branch_id: 0,
          name: context.name,
          task: 'DELETE_ROLE',
          details: `Deleted role with ID: ${id} and name: ${name}`
        });
        return id;
      } catch (error) {
        ThrowError(error);
      }
    },

  }

};

