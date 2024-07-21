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
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID.")
      }
      if (!hasPermission({ context, company_id, tasks: ["GET_ALL_DEPARTMENTS"] })) {
        ThrowError("#NO ACCESS.")
      }
      const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
      const calculatedOffset = offset * pageSize;
      const query = `
        SELECT id, name, description, created_at, updated_at
        FROM hr_departments
        WHERE company_id = :company_id
        ORDER BY id
        LIMIT :limit OFFSET :offset
      `;
      const params = {
        company_id,
        limit: pageSize,
        offset: calculatedOffset
      };
      try {
        const results = await DBObject.findDirect(query, params);
        return results;
      } catch (error) {
        ThrowError("Failed to find departments.");
      }
    },
  },

  Mutation: {
    async createDepartment(_, { company_id, name, description }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company.")
      };
      if (!hasPermission({ context, company_id, tasks: ["CREATE_DEPARTMENT"] })) {
        ThrowError("NO ACCESS.")
      };
      if (!Validate.string(name)) {
        ThrowError("Invalid name.")
      };
      if (!Validate.string(description)) {
        ThrowError("Invalid description.")
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
        const newDepartment = await DBObject.findOne('hr_departments', { id: insertId });
        if (!newDepartment) {
          ThrowError('Failed to fetch created department');
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          branch_id: context.branch_id,
          company_id,
          task: "CREATE_DEPARTMENT",
          details: `Created department: ${name}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error) => {
          ThrowError(error)
        });
        return insertId;
      } catch (error) {
        ThrowError("Error creating department");
      }
    },

    async updateDepartment(_, { id, company_id, name, description }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };
      if (!Validate.integer(id)) {
        ThrowError("Invalid ID.")
      }
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID.")
      };
      if (!Validate.string(name)) {
        ThrowError("Invalid name.")
      };
      if (!Validate.string(description)) {
        ThrowError("Invalid description.")
      };

      const updatedData = { company_id, name, description };
      try {
        const existingDepartment = await DBObject.findOne('hr_departments', { id, company_id });
        if (!existingDepartment) {
          ThrowError("Department not found or does not belong to the specified company");
        }
        if (!hasPermission({ context, company_id, tasks: ["UPDATE_DEPARTMENT"] })) {
          ThrowError("NO ACCESS.")
        };
        const updatedID = await DBObject.updateOne("hr_departments", updatedData, { id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          branch_id: context.branch_id,
          company_id,
          task: "UPDATE_DEPARTMENT",
          details: `Updated department: ${id}`
        }).catch((e) => {
          ThrowError(e.message)
        })
        return updatedID;
      } catch (error) {
        ThrowError("Error updating department information.");
      }
    },

    async deleteDepartment(_, { id }, context: Record<string, any>) {
      if (!Validate.integer(id)) {
        ThrowError("Invalid ID.")
      };
      try {
        const departmentToDelete = await DBObject.findOne('hr_departments', { id });
        if (!departmentToDelete) {
          ThrowError("Department not found.")
        };
        if (!hasPermission({ context, company_id: departmentToDelete.company_id, tasks: ["DELETE_DEPARTMENT"] })) {
          ThrowError("NO ACCESS.")
        }
        const deletedID = await DBObject.deleteOne("hr_departments", { id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          branch_id: context.branch_id,
          company_id: departmentToDelete.company_id,
          task: "DELETE_DEPARTMENT",
          details: `Deleted department: ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((e) => {
          ThrowError(e)
        })
        return deletedID;
      } catch (error) {
        ThrowError("Error deleting department.");
      }
    }
  }
}