
import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";

export default {
  Query: {
    async getAllEmployees(_, { company_id, offset }, context: Record<string, any>) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      if(!Validate.integer(company_id)) {
        ThrowError("Invalid company ID.")
      };

      if (!hasPermission({ context, company_id, tasks: ["GET_ALL_EMPLOYEES"] })) {
        ThrowError("NO ACCESS.")
      }

      const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
      const calculatedOffset = offset * pageSize;
      const query = `
              SELECT id, company_id, branch_id, details, type, category, balance, 
                     created_at, updated_at
              FROM accounts
              WHERE company_id = :company_id
                AND type = 'EMPLOYEE'  
              ORDER BY id
              LIMIT:limit OFFSET :offset
            `;
      const params = { 
        company_id,
        limit: pageSize,
        offset: calculatedOffset
      };

      try {
        const results = await DBObject.findDirect(query, params);
        SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "GET_ALL_EMPLOYEES",
          details: `Retrieved employees for company ${company_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error)=>{
          ThrowError(error);
        });
        return results.map(account => ({
          ...account,
          details: JSON.parse(account.details),
          type: account.type.toUpperCase(),
          category: account.category.toUpperCase(),
          balance: parseFloat(account.balance)
        }));
      } catch (error) {
        ThrowError("Failed to fetch employee.");
      }
    }
  },
  Mutation: {
    async createEmployee(_, { company_id, branch_id, details }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("RELOGIN")
      };
      if(!Validate.integer(company_id)){
        ThrowError("Invalid company.")
      };
      if(!Validate.integer(branch_id)){
        ThrowError("Invalid branch.")
      };
      if(!Validate.string(details)){
        ThrowError("Invalid details.")
      }

      if (!hasPermission({ context, company_id, tasks: ["CREATE_EMPLOYEE"] })) {
        ThrowError("NO ACCESS.")
      }

      const data = {
        company_id,
        branch_id,
        details: JSON.stringify(details),
        type: 'EMPLOYEE',
        category: 'STAFF',
        balance: 0
      };
      try {
        const insertedID = await DBObject.insertOne("accounts", data);
        SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "CREATE_EMPLOYEE",
          details: `Created employee account for company ${company_id}, branch ${branch_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((e)=>{
          ThrowError(e)
        });
        return insertedID;
      } catch (error) {
        ThrowError(error);
      }
    },
    async updateEmployee(_, { id, company_id, branch_id, details }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID.");
      }
      if (!Validate.integer(id)) {
        ThrowError("Invalid employee ID.")
      };
      if(!Validate.integer(branch_id)) {
        ThrowError("Invalid branch ID.")
      };
      if(!Validate.string(details)){
        ThrowError("Invalid details.")
      }

      if (!hasPermission({ context, company_id, tasks: ["UPDATE_EMPLOYEE"] })) {
        ThrowError("NO ACCESS.")
      }
      const updatedData = {
        company_id,
        branch_id,
        details: JSON.stringify(details),
      };
      try {
        const updatedID = await DBObject.updateOne("accounts", updatedData, { id, company_id });
        SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "UPDATE_EMPLOYEE",
          details: `Updated employee account ${id} for company ${company_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error) => {
          ThrowError(error.message)
        })
        return updatedID;
      } catch (error) {
        ThrowError("Error updating Employee");
      }
    },

    async deleteEmployee(_, { id }, context: Record<string, any>) {
      if (!Validate.integer(id)) {
        ThrowError("Invalid ID.");
      };
      try {
        const employeeToDelete = await DBObject.findOne("accounts", { id, type: 'EMPLOYEE' });
        if (!employeeToDelete){
          ThrowError("Employee not found");
        }
        if (!hasPermission({ context, company_id: employeeToDelete.company_id, tasks: ["DELETE_EMPLOYEE"] })) {
          ThrowError("NO ACCESS.")
        }

        const deletedID = await DBObject.deleteOne("accounts", { id });
        SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "DELETE_EMPLOYEE",
          details: `Deleted employee account ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error)=>{
          ThrowError(error);
        });
        return deletedID;
      } catch (error) {
        ThrowError("Error deleting Employee");
      }
    }
  }
}