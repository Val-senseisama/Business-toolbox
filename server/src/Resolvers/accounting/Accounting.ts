import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import { ThrowError, SaveAuditTrail, log } from "../../Helpers/Helpers.js";
import hasPermission from "../../Helpers/hasPermission.js";
import CONFIG from "../../config/config.js";
import { DateTime } from "luxon";

export default {
  Query: {
    async getAllLedgers(_, { company_id, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAllLedgers"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset.");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        let allLedgers = await DBObject.findDirect(`SELECT * FROM accounts WHERE company_id = :company_id AND type = 'LEDGER'  LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, { company_id: company_id });
        if (allLedgers.length === 0) {
          return []
        } else {
          return allLedgers;
        }
      } catch (error) {
        
        log("getAllLedgers Query Error", error);
        ThrowError("Failed to fetch ledgers.");
      }
    },

    async getAllAccountingyears(_, { company_id, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAllAccountingyears"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset.");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM accounting_year WHERE company_id = :company_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          limit: CONFIG.settings.PAGINATION_LIMIT,
          offset,
        });
      } catch (error) {
        
        log("getAllAccountingyears Query Error", error);
        ThrowError("Failed to fetch accounting years.");
      }
    },

    async getAlltransactions(
      _,
      { company_id, branch_id, accounting_year_id, offset },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAlltransactions"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.integer(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.positiveInteger(accounting_year_id)) {
        ThrowError("Invalid accounting year.");
      }
      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset.");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM transactions WHERE company_id = :company_id AND branch_id = :branch_id AND accounting_year_id = :accounting_year_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          branch_id,
          accounting_year_id,
        });
      } catch (error) {
        log("getAlltransactions Query Error", error);
        ThrowError("Failed to fetch transactions.");
      }
    },
    async getAccounttransactions(__, { company_id, branch_id, accounting_year_id, account_id, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid Company.")
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid Branch.")
      }
      if (!Validate.positiveInteger(accounting_year_id)) {
        ThrowError("Invalid Accounting year.")
      }
      if (!Validate.positiveInteger(account_id)) {
        ThrowError("Invalid Account.")
      }
      let all_accounts_trans;
      try {
        if (!Validate.positiveInteger(offset)) {
          all_accounts_trans = await DBObject.findDirect(`SELECT * FROM transactions WHERE company_id = :company_id AND branch_id = :branch_id AND accounting_year_id = :accounting_year_id AND account_id = :account_id`, {
            company_id, branch_id, accounting_year_id, account_id
          })
        } else {
          offset = offset * CONFIG.settings.PAGINATION_LIMIT;
          all_accounts_trans = await DBObject.findDirect(`SELECT * FROM transactions WHERE company_id = :company_id AND branch_id = :branch_id AND accounting_year_id = :accounting_year_id AND account_id = :account_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, {
            company_id, branch_id, accounting_year_id, account_id
          })
        }

        return all_accounts_trans;
      } catch (error) {
        ThrowError("Failed to fetch transactions.")
      }
    },
    async getCodetransactions(__, { company_id, branch_id, accounting_year_id, code, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid Company.")
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid Branch.")
      }
      if (!Validate.positiveInteger(accounting_year_id)) {
        ThrowError("Invalid Accounting year.")
      }
      if (!Validate.positiveInteger(code)) {
        ThrowError("Invalid Account.")
      }
      let all_accounts_trans;
      try {
        if (!Validate.positiveInteger(offset)) {
          all_accounts_trans = await DBObject.findDirect(`SELECT * FROM transactions WHERE company_id = :company_id AND branch_id = :branch_id AND accounting_year_id = :accounting_year_id AND code = :code`, {
            company_id, branch_id, accounting_year_id, code
          })
        } else {
          offset = offset * CONFIG.settings.PAGINATION_LIMIT;
          all_accounts_trans = await DBObject.findDirect(`SELECT * FROM transactions WHERE company_id = :company_id AND branch_id = :branch_id AND accounting_year_id = :accounting_year_id AND code = :code LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, {
            company_id, branch_id, accounting_year_id, code
          })
        }

        return all_accounts_trans = [];
      } catch (error) {
        ThrowError("Failed to fetch transactions.")
      }
    },
    async getTypetransactions(__, { company_id, branch_id, accounting_year_id, type, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid Company.")
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid Branch.")
      }
      if (!Validate.positiveInteger(accounting_year_id)) {
        ThrowError("Invalid Accounting year.")
      }
      let Types = ["ASSETS", "EQUITY", "EXPENSE", "INCOME", "LIABILITIES"];
      if (!Validate.string(type) || !Types.includes(type)) {
        ThrowError("Invalid Account type.")
      }

      try {
        let account_IDs = await DBObject.findMany("accounts", { company_id, branch_id, type }, {columns: "id"});
        if(account_IDs.length == 0){
          return [];
        }
        let transactions;
        if(!Validate.positiveInteger(offset)) {
          transactions = await DBObject.findDirect(`
            SELECT * FROM transactions 
            WHERE company_id = :company_id 
              AND branch_id = :branch_id 
              AND accounting_year_id = :accounting_year_id 
              AND account_id IN (:account_IDs)
          `, {
            company_id,
            branch_id,
            accounting_year_id,
            account_IDs: account_IDs.map(acc => acc.id),
          });
      
          return transactions;
        }else{
          offset = offset * CONFIG.settings.PAGINATION_LIMIT;
          transactions = await DBObject.findDirect(`
          SELECT * FROM transactions 
          WHERE company_id = :company_id 
            AND branch_id = :branch_id 
            AND accounting_year_id = :accounting_year_id 
            AND account_id IN (:account_IDs)
          LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}
        `, {
          company_id,
          branch_id,
          accounting_year_id,
          account_IDs: account_IDs.map(acc => acc.id),
        });
    
        return transactions;
        }
        
      } catch (error) {
        
        ThrowError("Failed to fetch transactions.")
      }
    }, 
    async getCategorytransactions(__, { company_id, branch_id, accounting_year_id, category, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid Company.")
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid Branch.")
      }
      if (!Validate.positiveInteger(accounting_year_id)) {
        ThrowError("Invalid Accounting year.")
      }
      let Categories = ['LEDGER', 'CUSTOMER', 'EMPLOYEE', 'VENDOR'];
      if (!Validate.string(category) || !Categories.includes(category)) {
        ThrowError("Invalid Account category.")
      }

      try {
        let account_IDs = await DBObject.findMany("accounts", { company_id, branch_id, category }, {columns: "id"});
        if(account_IDs.length == 0){
          return [];
        }
        let transactions;
        if(!Validate.positiveInteger(offset)) {
          transactions = await DBObject.findDirect(`
            SELECT * FROM transactions 
            WHERE company_id = :company_id 
              AND branch_id = :branch_id 
              AND accounting_year_id = :accounting_year_id 
              AND account_id IN (:account_IDs)
          `, {
            company_id,
            branch_id,
            accounting_year_id,
            account_IDs: account_IDs.map(acc => acc.id),
          });
      
          return transactions;
        }else{
          offset = offset * CONFIG.settings.PAGINATION_LIMIT;
          transactions = await DBObject.findDirect(`
          SELECT * FROM transactions 
          WHERE company_id = :company_id 
            AND branch_id = :branch_id 
            AND accounting_year_id = :accounting_year_id 
            AND account_id IN (:account_IDs)
          LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}
        `, {
          company_id,
          branch_id,
          accounting_year_id,
          account_IDs: account_IDs.map(acc => acc.id),
        });
    
        return transactions;
        }
        
      } catch (error) {
        
        ThrowError("Failed to fetch transactions.")
      }
    },
    async getAllCustomers(__, { company_id, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid Company.")
      }
      if (!Validate.positiveInteger(offset)) {
        ThrowError("Invalid offset.")
      }
      let customers;
      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        customers = await DBObject.findDirect(`SELECT * FROM accounts WHERE company_id = :company_id AND category = 'CUSTOMER' LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, { company_id });
      } catch (error) {
        ThrowError("Failed to fetch customers.")
      }
      return customers;
    },
    async getAllVendors(__, { company_id, offset }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid Company.")
      }
      if (!Validate.positiveInteger(offset)) {
        ThrowError("Invalid offset.")
      }
      let vendors;
      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        vendors = await DBObject.findDirect(`SELECT * FROM accounts WHERE company_id = :company_id AND category = 'VENDOR' LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, { company_id });
      } catch (error) {
        ThrowError("Failed to fetch vendors.")
      }
      return vendors;
    },
    async getAllPayrolls(__, { company_id, offset }, context) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      if(!Validate.positiveInteger(company_id)){
        ThrowError("Invalid Company.")
      }
      if(!Validate.positiveInteger(offset)){
        ThrowError("Invalid offset.")
      }
      let payrolls;
      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        payrolls = await DBObject.findDirect(`SELECT * FROM payrolls WHERE company_id = :company_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, { company_id });
      }catch(error){
        
        ThrowError("Failed to fetch payrolls.")
      }
      return payrolls;
    }
  },
  Mutation: {
    async createLedger(_, { company_id, branch_id, details, type }, context) {
      if (!context) {
        ThrowError("#RELOGIN");
      }
      if (!hasPermission({ context, company_id, tasks: ["createLedger"] })) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.object(details)) {
        ThrowError("Invalid details.");
      }
      const types = ["ASSETS", "EQUITY", "EXPENSE", "INCOME", "LIABILITIES"];
      if (!Validate.string(type) || !types.includes(type)) {
        ThrowError("Invalid Ledger type.");
      }

      try {
        const ledgerData = {
          company_id,
          branch_id,
          details: JSON.stringify(details),
          type: type,
          category: "LEDGER",
        };
        const insertId = await DBObject.insertOne("accounts", ledgerData);
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          branch_id,
          task: "createLedger",
          details: `Created ledger for company ${company_id}`,
        });
        if (!Validate.positiveInteger(insertId)) {
          ThrowError("Failed to create ledger.");
        }
        return await DBObject.findOne("accounts", { id: insertId }, { columns: "id, company_id, branch_id, details, type, category, balance, created_at, updated_at" });
      } catch (error) {
        log("createLedger Mutation Error", error);
        ThrowError("Failed to create ledger.");
      }
    },

    async updateLedger(_, { id, company_id, branch_id, details }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["updateLedger"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid ledger ID.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.object(details)) {
        ThrowError("Invalid details.");
      }

      try {
        const updatedData = { details: JSON.stringify(details) };
        let update = await DBObject.updateOne("accounts", updatedData, { id, company_id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          branch_id,
          task: "updateLedger",
          details: `Updated ledger ID: ${id}`,
        });
        if (!Validate.positiveInteger(update)) {
          ThrowError("Failed to update ledger.");
        }
        return await DBObject.findOne("accounts", { id: id, company_id: company_id }, { columns: "id, company_id, branch_id, details, type, category, balance, created_at, updated_at" });
      } catch (error) {
        log("updateLedger Mutation Error", error);
        ThrowError("Failed to update ledger.");
      }
    },

    async deleteLedger(_, { id, company_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deleteLedger"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid ledger ID.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }

      try {
        let deleted = await DBObject.deleteOne("accounts", { id, company_id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "deleteLedger",
          details: `Deleted ledger ID: ${id}`,
        });
        if (!Validate.positiveInteger(deleted)) {
          ThrowError("Failed to delete ledger.");
        }
        return deleted;
      } catch (error) {
        log("deleteLedger Mutation Error", error);
        ThrowError("Failed to delete ledger.");
      }
    },

    async createCustomer(_, { company_id, branch_id, details }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["createCustomer"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.object(details)) {
        ThrowError("Invalid details.");
      }

      try {
        const customerData = {
          company_id,
          branch_id,
          details: JSON.stringify(details),
          type: "ASSETS",
          category: "CUSTOMER",
        };
        const insertId = await DBObject.insertOne("accounts", customerData);
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          branch_id,
          task: "createCustomer",
          details: `Created customer for company ${company_id}`,
        });
        return await DBObject.findOne("accounts", { id: insertId }, { columns: "id, company_id, branch_id, details, type, category, balance, created_at, updated_at" });
      } catch (error) {
        log("createCustomer Mutation Error", error);
        ThrowError("Failed to create customer.");
      }
    },

    async updateCustomer(_, { id, company_id, branch_id, details }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["updateCustomer"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid customer ID.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.object(details)) {
        ThrowError("Invalid details.");
      }
      let customer = await DBObject.findOne("accounts", { id: id });
      if (!customer) {
        ThrowError("Invalid Customer")
      }
      try {
        await DBObject.updateOne("accounts", { details: JSON.stringify(details) }, { id, company_id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          branch_id,
          task: "updateCustomer",
          details: `Updated customer ID: ${id}`,
        });
        return await DBObject.findOne("accounts", { id: id }, { columns: "id, company_id, branch_id, details, type, category, balance, created_at, updated_at" });
      } catch (error) {
        
        log("updateCustomer Mutation Error", error);
        ThrowError("Failed to update customer.");
      }
    },

    async deleteCustomer(_, { id, company_id }, context) {
      if (!context) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deleteCustomer"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid customer.");
      }
      let customer = await DBObject.findOne("accounts", { id: id });
      if (!customer) {
        ThrowError("Invalid Customer")
      }
      try {
        let deleted = await DBObject.deleteOne("accounts", { id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "deleteCustomer",
          details: `Deleted customer ID: ${id}`,
        });
        if (!Validate.positiveInteger(deleted)) {
          ThrowError("Failed to delete customer.");
        }
        return deleted;
      } catch (error) {
        log("deleteCustomer Mutation Error", error);
        ThrowError("Failed to delete customer.");
      }
    },

    async createVendor(_, { company_id, branch_id, details }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["createVendor"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.object(details)) {
        ThrowError("Invalid details.");
      }

      try {
        const vendorData = {
          company_id,
          branch_id,
          details: JSON.stringify(details),
          type: "EXPENSE",
          category: "VENDOR",
        };
        const insertId = await DBObject.insertOne("accounts", vendorData);
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          branch_id,
          task: "createVendor",
          details: `Created vendor for company ${company_id}`,
        });
        return await DBObject.findOne("accounts", { id: insertId }, { columns: "id, company_id, branch_id, details, type, category, balance, created_at, updated_at" });
      } catch (error) {
        
        log("createVendor Mutation Error", error);
        ThrowError("Failed to create vendor.");
      }
    },

    async updateVendor(_, { id, company_id, branch_id, details }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["updateVendor"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid vendor ID.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.object(details)) {
        ThrowError("Invalid details.");
      }

      let vendor = await DBObject.findOne("accounts", { id: id });
      if (!vendor) {
        ThrowError("Invalid Vendor")
      }

      try {
        await DBObject.updateOne("accounts", { details: JSON.stringify(details) }, { id, company_id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          branch_id,
          task: "updateVendor",
          details: `Updated vendor ID: ${id}`,
        });
        return await DBObject.findOne("accounts", { id: id }, { columns: "id, company_id, branch_id, details, type, category, balance, created_at, updated_at" });
      } catch (error) {
        log("updateVendor Mutation Error", error);
        ThrowError("Failed to update vendor.");
      }
    },

    async deleteVendor(_, { id, company_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deleteVendor"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid vendor ID.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      let vendor = await DBObject.findOne("accounts", { id: id });
      if (!vendor) {
        ThrowError("Invalid Vendor")
      }

      try {
        let deleted = await DBObject.deleteOne("accounts", { id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "deleteVendor",
          details: `Deleted vendor ID: ${id}`,
        });
        return deleted;
      } catch (error) {
        log("deleteVendor Mutation Error", error);
        ThrowError("Failed to delete vendor.");
      }
    },

    async createAccountingYear(
      _,
      { company_id, name, start_date, end_date },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["createAccountingYear"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      }
      if (!Validate.date(start_date)) {
        ThrowError("Invalid start date.");
      }
      if (!Validate.date(end_date)) {
        ThrowError("Invalid end date.");
      }

      try {
        const yearData = { company_id, name, start_date: DateTime.fromSQL(start_date).toSQLDate(), end_date: DateTime.fromSQL(end_date).toSQLDate() };
        const insertId = await DBObject.insertOne("accounting_year", yearData);
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "createAccountingYear",
          details: `Created accounting year: ${name}`,
        });
        return await DBObject.findOne("accounting_year", { id: insertId }, { columns: "id, company_id, name, start_date, end_date, status, created_at, updated_at" });
      } catch (error) {
        log("createAccountingYear Mutation Error", error);
        ThrowError("Failed to create accounting year.");
      }
    },

    async updateAccountingYear(
      _,
      { id, company_id, name, start_date, end_date },
      context
    ) {
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["updateAccountingYear"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid year ID.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      }
      if (!Validate.date(start_date)) {
        ThrowError("Invalid start date.");
      }
      if (!Validate.date(end_date)) {
        ThrowError("Invalid end date.");
      }
      const accountYear = await DBObject.findOne("accounting_year", { id });
      if (!accountYear) {
        ThrowError("Invalid Account year.");
      }
      try {
        const updatedData = { name, start_date: DateTime.fromSQL(start_date).toSQLDate(), end_date: DateTime.fromSQL(end_date).toSQLDate() };
        await DBObject.updateOne("accounting_year", updatedData, {
          id,
          company_id,
        });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "updateAccountingYear",
          details: `Updated accounting year ID: ${id}`,
        });
        return await DBObject.findOne("accounting_year", { id }, { columns: "id, company_id, name, start_date, end_date, status, created_at, updated_at" });
      } catch (error) {
        log("updateAccountingYear Mutation Error", error);
        ThrowError("Failed to update accounting year.");
      }
    },

    async closeAccountingYear(
      _,
      { id, company_id, new_accounting_year_id },
      context
    ) {
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["closeAccountingYear"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid year ID.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      // if (!Validate.integer(new_accounting_year_id)) {
      //   ThrowError("Invalid new accounting year ID.");
      // }
      const accountYear = await DBObject.findOne("accounting_year", { id });
      if (!accountYear) {
        ThrowError("Invalid Account year.");
      }
      try {
        let update = await DBObject.updateOne(
          "accounting_year",
          { status: "CLOSED" },
          { id, company_id }
        );
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "closeAccountingYear",
          details: `Closed accounting year ID: ${id}`,
        });
        if (!Validate.positiveInteger(update)) {
          ThrowError("Failed to close accounting year.");
        }
        return update;
      } catch (error) {
        log("closeAccountingYear Mutation Error", error);
        ThrowError("Failed to close accounting year.");
      }
    },

    async deleteAccountingYear(_, { id, company_id }, context) {
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deleteAccountingYear"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid year ID.");
      }
      const accountYear = await DBObject.findOne("accounting_year", { id });
      if (!accountYear) {
        ThrowError("Invalid Account year.");
      }
      try {
        await DBObject.deleteOne("accounting_year", { id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "deleteAccountingYear",
          details: `Deleted accounting year ID: ${id}`,
        });
        return id;
      } catch (error) {
        log("deleteAccountingYear Mutation Error", error);
        ThrowError("Failed to delete accounting year.");
      }
    },

    async postTransaction(
      _,
      { company_id, branch_id, source, destination, value_date, remarks },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["postTransaction"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.integer(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.array(source) || !Validate.array(destination)) {
        ThrowError("Invalid transaction components.");
      }

      // Transaction logic would be here, this assumes it handles batch transactions
      try {
        const transactionData = { company_id, branch_id, value_date, remarks };
        // Assuming you will handle transaction creation logic
        const transactionId = await DBObject.insertOne(
          "transactions",
          transactionData
        );
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "postTransaction",
          details: `Posted transaction ID: ${transactionId}`,
        });
        return await DBObject.findMany("transactions", { company_id: company_id, branch_id: branch_id }, { columns: "id, company_id, branch_id, account_id, accounting_year_id, code, amount, value_date, remarks, counterpart, created_at" });
      } catch (error) {
        
        log("postTransaction Mutation Error", error);
        ThrowError("Failed to post transaction.");
      }
    },

    async deleteTransaction(_, { company_id, branch_id, id }, context) {
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deleteTransaction"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid transaction.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      let transactsCode = await DBObject.findOne("transactions", { id, company_id, branch_id });
      if (!transactsCode) {
        ThrowError("Transaction not found.");
      }
      try {
        await DBObject.deleteMany("transactions", { code: transactsCode.code });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "deleteTransaction",
          details: `Deleted transaction ID: ${id}`,
        });
        return "Transaction deleted successfully.";
      } catch (error) {
        log("deleteTransaction Mutation Error", error);
        ThrowError("Failed to delete transaction.");
      }
    },

    async createPayroll(_, { company_id, branch_id, name, schedule, salaries_total }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["createPayroll"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.integer(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      }
      if (!Validate.array(schedule)) {
        ThrowError("Invalid schedule.");
      }
      if(!Validate.float(salaries_total)) {
        ThrowError("Invalid Salaries total.")
      }

      try {
        const payrollData = {
          company_id,
          branch_id,
          name,
          schedule: JSON.stringify(schedule),
          salaries_total,
        };
        const insertId = await DBObject.insertOne("payrolls", payrollData);
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "createPayroll",
          details: `Created payroll: ${name}`,
        }).catch((error) => {
          /*  */
        });
        return await DBObject.findOne("payrolls", { id: insertId }, { columns: "id, company_id, branch_id, name, code, schedule, salaries_total, tax_total, salaries_liabilities_posted, salaries_expenses_posted, loan_liabilities_posted, penalties_expense_posted, union_dues_liabilities_posted, union_dues_expenses_posted, health_liabilities_posted, health_expenses_posted, retirements_liabilities_posted, retirements_expenses_posted, other_deductions_liabilities_posted, other_deductions_expenses_posted, tax_liabilities_posted, tax_expenses_posted, created_at, updated_at" });
      } catch (error) {
        
        
        log("createPayroll Mutation Error", error);
        ThrowError("Failed to create payroll.");
      }
    },

    async updatePayroll(
      _,
      { id, company_id, branch_id, name, schedule, salaries_total },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["updatePayroll"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid payroll.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      }
      if (!Validate.array(schedule)) {
        ThrowError("Invalid schedule.");
      }
      if(!Validate.float(salaries_total)) {
        ThrowError("Invalid Salaries total.")
      }

      try {
        const updatedData = { name, schedule: JSON.stringify(schedule), salaries_total };
        await DBObject.updateOne("payrolls", updatedData, { id, company_id, branch_id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "updatePayroll",
          details: `Updated payroll ID: ${id}`,
        });
        return await DBObject.findOne("payrolls", { id: id }, { columns: "id, company_id, branch_id, name, code, schedule, salaries_total, tax_total, salaries_liabilities_posted, salaries_expenses_posted, loan_liabilities_posted, penalties_expense_posted, union_dues_liabilities_posted, union_dues_expenses_posted, health_liabilities_posted, health_expenses_posted, retirements_liabilities_posted, retirements_expenses_posted, other_deductions_liabilities_posted, other_deductions_expenses_posted, tax_liabilities_posted, tax_expenses_posted, created_at, updated_at" });
      } catch (error) {
        
        log("updatePayroll Mutation Error", error);
        ThrowError("Failed to update payroll.");
      }
    },

    async deletePayroll(_, { id, company_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deletePayroll"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid payroll ID.");
      }
      let payroll = await DBObject.findOne("payrolls", { id, company_id });
      if (!payroll) {
        ThrowError("Payroll not found.");
      }

      try {
        let deleted = await DBObject.deleteOne("payrolls", { id });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "deletePayroll",
          details: `Deleted payroll ID: ${id}`,
        });
        if (!Validate.positiveInteger(deleted)) {
          ThrowError("Failed to delete payroll.");
        }
        return deleted;
      } catch (error) {
        
        log("deletePayroll Mutation Error", error);
        ThrowError("Failed to delete payroll.");
      }
    },

    async postPayrollLiability(
      _,
      { company_id, branch_id, payroll_id, header_name },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["postPayrollLiability"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.integer(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.positiveInteger(payroll_id)) {
        ThrowError("Invalid payroll ID.");
      }
      if (!Validate.string(header_name)) {
        ThrowError("Invalid header name.");
      }

      try {
        const insertId = await DBObject.insertOne("payroll_liabilities", {
          company_id,
          branch_id,
          payroll_id,
          header_name,
        });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "postPayrollLiability",
          details: `Posted payroll liability for ${header_name}`,
        });
        if (!Validate.positiveInteger(insertId)) {
          ThrowError("Failed to post payroll liability.");
        }
        return insertId;
      } catch (error) {
        
        log("postPayrollLiability Mutation Error", error);
        ThrowError("Failed to post payroll liability.");
      }
    },

    async postPayrollExpense(
      _,
      { company_id, branch_id, payroll_id, header_name, bank_id },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["postPayrollExpense"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.integer(branch_id)) {
        ThrowError("Invalid branch.");
      }
      if (!Validate.positiveInteger(payroll_id)) {
        ThrowError("Invalid payroll.");
      }
      if (!Validate.string(header_name)) {
        ThrowError("Invalid header name.");
      }
      if (!Validate.positiveInteger(bank_id)) {
        ThrowError("Invalid bank.");
      }

      try {
        const insertId = await DBObject.insertOne("payroll_expenses", {
          company_id,
          branch_id,
          payroll_id,
          header_name,
          bank_id,
        });
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "postPayrollExpense",
          details: `Posted payroll expense for ${header_name}`,
        });
        if (!Validate.positiveInteger(insertId)) {
          ThrowError("Failed to post payroll expense.");
        }
        return insertId;
      } catch (error) {
        log("postPayrollExpense Mutation Error", error);
        ThrowError("Failed to post payroll expense.");
      }
    },
  },
};
