

import { ThrowError, SaveAuditTrail } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
  Query: {
    getAllCompanyRoles: async (_, { company_id, offset }: Record<string, number>, context: Record<string, any>) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const query = `
        SELECT id, name, description, permissions, created_at, updated_at
        FROM roles
        WHERE company_id = :company_id
        ORDER BY id
        LIMIT 10 OFFSET :offset
      `;

      const params = {
        company_id: company_id,
        offset: offset
      };

      return await DBObject.findDirect(query, params);
    },
  },
  Mutation: {
    createRole: async (_, { company_id, name, json }: Record<string, any>, context: Record<string, any>) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const newRole = {
        company_id,
        name,
        json: JSON.stringify(json),
      };
      const roleId = await DBObject.insertOne("roles", newRole);

      await SaveAuditTrail({
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
    },
    updateRole: async (_, { id, name, json, status }: Record<string, any>, context: Record<string, any>) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const updateData = {
        name,
        json: JSON.stringify(json),
        status: status ? 'ACTIVE' : 'BLOCKED',
      };
      await DBObject.updateOne("roles", updateData, { id });

      const updatedRole = await DBObject.findOne("roles", { id });

      await SaveAuditTrail({
        user_id: context.id,
        company_id: updatedRole.company_id,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'UPDATE_ROLE',
        details: `Updated role with ID: ${id}`
      });

      return updatedRole;
    },
  }
};
