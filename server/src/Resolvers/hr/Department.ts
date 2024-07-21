import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";

export default {
  Query: {
    async getAllDepartments(_, { company_id, offset }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.")
      }
      const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
      const calculatedOffset = offset * pageSize;
      const query = `SELECT * FROM hr_departments
        WHERE company_id = :company_id LIMIT :limit OFFSET :offset`;
      const params = {
        company_id,
        limit: pageSize,
        offset: calculatedOffset
      };
      try {
        const results = await DBObject.findDirect(query, params);
        return results;
      } catch (error) {
        ThrowError("Failed to fetch departments.");
      }
    },
  },

  Mutation: {
    async createDepartment(_, { company_id, name, description }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };


      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.")
      };

      if (!Validate.string(name)) {
        ThrowError("Invalid name.")
      };

      const data = {
        company_id,
        name,
        description,
      };

      try {
        const insertId = await DBObject.insertOne('hr_departments', data);
        if (!insertId) {
          ThrowError('Failed to create department');
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          branch_id: 0,
          company_id,
          task: "CREATE_DEPARTMENT",
          details: `Created department: ${name}`
        })
        return await DBObject.findOne("hr_departments", { id: insertId });
      } catch (error) {
        ThrowError("Error creating department");
      }
    },

    async updateDepartment(_, { id, company_id, name, description }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.")
      };

      if (!Validate.string(name)) {
        ThrowError("Invalid name.")
      };

      const updatedData = { name, description };
      try {
        const updatedID = await DBObject.updateOne("hr_departments", updatedData, { id, company_id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          branch_id: 0,
          company_id,
          task: "UPDATE_DEPARTMENT",
          details: `Updated department: ${id} to ${JSON.stringify(updatedData)}`,
        })
        return await DBObject.findOne("hr_departments", { id });
      } catch (error) {
        ThrowError("Error updating department information.");
      }
    },

    async deleteDepartment(_, { company_id, id }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }
      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid department.")
      };

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.")
      }

      try {
        const deletedID = await DBObject.deleteOne("hr_departments", { id, company_id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id: company_id,
          task: "DELETE_DEPARTMENT",
          details: `Deleted department: ${id}`
        })
        return deletedID;
      } catch (error) {
        ThrowError("Error deleting department.");
      }
    }
  }
}