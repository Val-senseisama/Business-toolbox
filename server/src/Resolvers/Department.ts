import { SaveAuditTrail, ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
  Query: {
    async getAllDepartments(_, { company_id, offset }, context) {
      const query = `
        SELECT id, name, description, created_at, updated_at
        FROM hr_departments
        WHERE company_id = :company_id
        ORDER BY id
        LIMIT 10 OFFSET :offset
      `;
    
      const params = { company_id, offset };
    
      try {
        const results = await DBObject.findDirect(query, params);

        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id,
          task: "GET_ALL_DEPARTMENTS",
          details: `Retrieved departments for company ${company_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });
        return results;
      } catch (error) {
        ThrowError("Failed to find departments");
      }
    },
  },
  Mutation: {
    async createDepartment(_, { company_id, name, description }, context) {
      if (!company_id) {
        ThrowError("Invalid company")
    };
      if (!name) {
        ThrowError("Invalid name")
      };

      const data = {
        company_id,
        name,
        description,
        created_at: DateTime.now().toUTC().toISO(),
        updated_at: DateTime.now().toUTC().toISO(),
      };

      try {
        const insertId = await DBObject.insertOne('hr_departments', data);
        if (!insertId) ThrowError('Failed to create department');

        const newDepartment = await DBObject.findOne('hr_departments', { id: insertId });
        if (!newDepartment) ThrowError('Failed to fetch created department');

        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id,
          task: "CREATE DEPARTMENT",
          details: `Created department: ${name}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });
        return insertId;
      } catch (error) {
        ThrowError("Error creating department");
      }
    },

    async updateDepartment(_, { id, company_id, name, description }, context) {
      if (!id) {
        ThrowError("Invalid department ID")
    };
      if (!company_id) {
        ThrowError("Invalid company")
      };
      if (!name) {
        ThrowError("Invalid name")
      };

      const updatedData = { company_id, name, description };

      try {
        const existingDepartment = await DBObject.findOne('hr_departments', { id, company_id });
        if (!existingDepartment) {
          ThrowError("Department not found or does not belong to the specified company");
        }

        const updatedID = await DBObject.updateOne("hr_departments", updatedData, { id });
        

        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id,
          task: "UPDATE_DEPARTMENT",
          details: `Updated department: ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });

        return updatedID;
      } catch (error) {
        ThrowError("Error updating department information");
      }
    },

    async deleteDepartment(_, { id }, context) {
      if (!id) {
        ThrowError("Invalid ID")
      };
      
      try {
        const departmentToDelete = await DBObject.findOne('hr_departments', { id });
        if (!departmentToDelete) {
          ThrowError("Department not found")
        };

        const deletedID = await DBObject.deleteOne("hr_departments", { id });

        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: departmentToDelete.company_id,
          task: "UPDATE_DEPARTMENT",
          details: `Deleted department: ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });
        return deletedID;
      } catch (error) {
        ThrowError("Error deleting department");
      }
    }
  }
}