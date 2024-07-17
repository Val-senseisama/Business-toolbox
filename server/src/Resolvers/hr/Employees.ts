import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
  Query: {
    async getAllEmployees(_, { company_id, offset }, context) {
      const query = `
              SELECT id, company_id, branch_id, details, type, category, balance, 
                     created_at, updated_at
              FROM accounts
              WHERE company_id = :company_id
                AND type = 'EMPLOYEE'  
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
          company_id: context.company_id,
          task: "GET_ALL_EMPLOYEES",
          details: `Retrieved employees for company ${company_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });

        return results.map(account => ({
          ...account,
          details: JSON.parse(account.details),
          type: account.type.toUpperCase(),
          category: account.category.toUpperCase(),
          balance: parseFloat(account.balance),
          created_at: account.created_at.toUTC().toISO(),
          updated_at: account.updated_at.toUTC().toISO()
        }));
      } catch (error) {
        console.error("Error fetching employees:", error);
        ThrowError("Failed fetching employees");
      }
    }
  },
  Mutation: {
    async createEmployee(_, { company_id, branch_id, details }, context) {
      if (!context.id) {
        ThrowError("RELOGIN")
      };
      if (!company_id) {
        ThrowError("Invalid company");
      }
      const data = {
        company_id,
        branch_id,
        details: JSON.stringify(details),
        type: 'EMPLOYEE',
        category: 'STAFF',
        balance: 0,
        created_at: DateTime.now().toUTC().toISO(),
        updated_at: DateTime.now().toUTC().toISO(),
      };
      try {
        const insertedID = await DBObject.insertOne("accounts", data);
        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "CREATE_EMPLOYEE",
          details: `Created employee account for company ${company_id}, branch ${branch_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });

        return insertedID;
      } catch (error) {
        console.error("Error inserting employee:", error);
        ThrowError("Couldn't insert employee");
      }
    },
    async updateEmployee(_, { id, company_id, branch_id, details }, context) {
      if (!context.id) {
        ThrowError("RELOGIN")
      };
      if (!company_id) {
        ThrowError("Invalid company");
      }
      if (!id) {
        ThrowError("Invalid employee ID")
      };

      const updatedData = {
        company_id,
        branch_id,
        details: JSON.stringify(details),
        updated_at: DateTime.now().toUTC().toISO()
      };
      try {
        const updatedID = await DBObject.updateOne("accounts", updatedData, { id, company_id });

        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "UPDATE_EMPLOYEE",
          details: `Updated employee account ${id} for company ${company_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });

        return updatedID;
      } catch (error) {
        console.error("Error updating employee:", error);
        ThrowError("Error updating Employee");
      }
    },
    async deleteEmployee(_, { id }, context) {
      if (!id) {
        ThrowError("Invalid ID");
      }
      try {
        const employeeToDelete = await DBObject.findOne("accounts", { id, type: 'EMPLOYEE' });
        if (!employeeToDelete) ThrowError("Employee not found");

        const deletedID = await DBObject.deleteOne("accounts", { id });

        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "DELETE_EMPLOYEE",
          details: `Deleted employee account ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });

        return deletedID;
      } catch (error) {
        console.error("Error deleting employee:", error);
        ThrowError("Error deleting Employee");
      }
    }
  }
}