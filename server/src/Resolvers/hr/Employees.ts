
import { log, SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import CONFIG from "../../config/config.js";

export default {
  Query: {
    async getAllEmployees(_, { company_id, offset }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.")
      };

      const pageSize = CONFIG.settings.PAGINATION_LIMIT || 30;
      const calculatedOffset = offset * pageSize;
      const query = `SELECT * FROM accounts
              WHERE company_id = :company_id AND type = 'EMPLOYEE' LIMIT:limit OFFSET :offset`;
      const params = {
        company_id,
        limit: pageSize,
        offset: calculatedOffset
      };

      try {
        const results = await DBObject.findDirect(query, params);

        return results.map(account => {
          let details = {};
          try {
            details = JSON.parse(account.details);
          } catch (error) {
            details = {};
          }
          return {
            ...account,
            details,
            balance: parseFloat(account.balance)
          }
        });
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

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.")
      };


      if (!Validate.string(details)) {
        ThrowError("Invalid details.")
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
        if (!insertedID) {
          ThrowError("Failed to create employee.");
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "CREATE_EMPLOYEE",
          details: `Created employee ${JSON.stringify(details)}`
        })

        return await DBObject.findOne("accounts", { id: insertedID });
      } catch (error) {
        log("CreateEmployee", error);
        ThrowError("Failed to create employee.");
      }
    },

    async updateEmployee(_, { id, company_id, branch_id, details }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid employee.")
      };

      if (!Validate.object(details)) {
        ThrowError("Invalid details.")
      }

      const updatedData = {
        branch_id,
        details: JSON.stringify(details),
      };
      try {
        const updatedID = await DBObject.updateOne("accounts", updatedData, { id, company_id });
        if (!updatedID) {
          ThrowError("Failed to update employee.");
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          branch_id: context.branch_id,
          company_id: context.company_id,
          task: "UPDATE_EMPLOYEE",
          details: `Updated employee account ${id} to ${JSON.stringify(details)}`
        })

        return await DBObject.findOne("accounts", { id: updatedID });
      } catch (error) {
        log("UpdateEmployee", error);
        ThrowError("Error updating Employee");
      }
    },

    async deleteEmployee(_, { id, company_id }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("#NOACCESS")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid employee.")
      }

      try {
        const deletedID = await DBObject.deleteOne("accounts", { id, company_id });
        if (!deletedID) {
          ThrowError("Failed to delete employee.");
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id: context.company_id,
          task: "DELETE_EMPLOYEE",
          details: `Deleted employee account ${id}`
        })
        return deletedID;
      } catch (error) {
        log("DeleteEmployee", error);
        ThrowError("Error deleting Employee");
      }
    }
  }
};