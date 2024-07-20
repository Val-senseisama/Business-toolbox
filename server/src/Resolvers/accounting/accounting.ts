import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import { ThrowError, SaveAuditTrail, log } from "../../Helpers/Helpers.js";
import hasPermission from "../../Helpers/hasPermission.js";
import CONFIG from "../../config/config.js";

export default {
  Query: {
    async getAllLedgers(_, { company_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAllLedgers'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(offset)) { ThrowError('Invalid offset.'); }

      try {
        const query = `SELECT * FROM accounts WHERE company_id = :company_id AND type = 'LEDGER' LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAllLedgers Query Error', error);
        ThrowError('Failed to fetch ledgers.');
      }
    },

    async getAllAccountingyears(_, { company_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAllAccountingyears'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(offset)) { ThrowError('Invalid offset.'); }

      try {
        const query = `SELECT * FROM accounting_year WHERE company_id = :company_id LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAllAccountingyears Query Error', error);
        ThrowError('Failed to fetch accounting years.');
      }
    },

    async getAlltransactions(_, { company_id, branch_id, accounting_year_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAlltransactions'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.positiveInteger(accounting_year_id)) { ThrowError('Invalid accounting year.'); }
      if (!Validate.integer(offset)) { ThrowError('Invalid offset.'); }

      try {
        const query = `SELECT * FROM transactions WHERE company_id = :company_id AND branch_id = :branch_id AND accounting_year_id = :accounting_year_id LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, branch_id, accounting_year_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAlltransactions Query Error', error);
        ThrowError('Failed to fetch transactions.');
      }
    },

    async createLedger(_, { company_id, branch_id, details }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['createLedger'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.object(details)) { ThrowError('Invalid details.'); }

      try {
        const ledgerData = { company_id, branch_id, details: JSON.stringify(details), type: 'LEDGER' };
        const insertId = await DBObject.insertOne('accounts', ledgerData);
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, branch_id, task: 'createLedger', details: `Created ledger for company ${company_id}` });
        return insertId;
      } catch (error) {
        log('createLedger Mutation Error', error);
        ThrowError('Failed to create ledger.');
      }
    },

    async updateLedger(_, { id, company_id, branch_id, details }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateLedger'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid ledger ID.'); }
      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.object(details)) { ThrowError('Invalid details.'); }

      try {
        const updatedData = { details: JSON.stringify(details) };
        await DBObject.updateOne('accounts', updatedData, { id, company_id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, branch_id, task: 'updateLedger', details: `Updated ledger ID: ${id}` });
        return id;
      } catch (error) {
        log('updateLedger Mutation Error', error);
        ThrowError('Failed to update ledger.');
      }
    },

    async deleteLedger(_, { id, company_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deleteLedger'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid ledger ID.'); }
      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }

      try {
        await DBObject.deleteOne('accounts', { id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'deleteLedger', details: `Deleted ledger ID: ${id}` });
        return id;
      } catch (error) {
        log('deleteLedger Mutation Error', error);
        ThrowError('Failed to delete ledger.');
      }
    },

    async createCustomer(_, { company_id, branch_id, details }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['createCustomer'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.object(details)) { ThrowError('Invalid details.'); }

      try {
        const customerData = { company_id, branch_id, details: JSON.stringify(details), type: 'CUSTOMER' };
        const insertId = await DBObject.insertOne('accounts', customerData);
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, branch_id, task: 'createCustomer', details: `Created customer for company ${company_id}` });
        return insertId;
      } catch (error) {
        log('createCustomer Mutation Error', error);
        ThrowError('Failed to create customer.');
      }
    },

    async updateCustomer(_, { id, company_id, branch_id, details }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateCustomer'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid customer ID.'); }
      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.object(details)) { ThrowError('Invalid details.'); }

      try {
        const updatedData = { details: JSON.stringify(details) };
        await DBObject.updateOne('accounts', updatedData, { id, company_id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, branch_id, task: 'updateCustomer', details: `Updated customer ID: ${id}` });
        return id;
      } catch (error) {
        log('updateCustomer Mutation Error', error);
        ThrowError('Failed to update customer.');
      }
    },

    async deleteCustomer(_, { id, company_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deleteCustomer'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid customer ID.'); }

      try {
        await DBObject.deleteOne('accounts', { id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'deleteCustomer', details: `Deleted customer ID: ${id}` });
        return id;
      } catch (error) {
        log('deleteCustomer Mutation Error', error);
        ThrowError('Failed to delete customer.');
      }
    },

    async createVendor(_, { company_id, branch_id, details }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['createVendor'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.object(details)) { ThrowError('Invalid details.'); }

      try {
        const vendorData = { company_id, branch_id, details: JSON.stringify(details), type: 'VENDOR' };
        const insertId = await DBObject.insertOne('accounts', vendorData);
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, branch_id, task: 'createVendor', details: `Created vendor for company ${company_id}` });
        return insertId;
      } catch (error) {
        log('createVendor Mutation Error', error);
        ThrowError('Failed to create vendor.');
      }
    },

    async updateVendor(_, { id, company_id, branch_id, details }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateVendor'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid vendor ID.'); }
      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.object(details)) { ThrowError('Invalid details.'); }

      try {
        const updatedData = { details: JSON.stringify(details) };
        await DBObject.updateOne('accounts', updatedData, { id, company_id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, branch_id, task: 'updateVendor', details: `Updated vendor ID: ${id}` });
        return id;
      } catch (error) {
        log('updateVendor Mutation Error', error);
        ThrowError('Failed to update vendor.');
      }
    },

    async deleteVendor(_, { id, company_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deleteVendor'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid vendor ID.'); }
      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }

      try {
        await DBObject.deleteOne('accounts', { id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'deleteVendor', details: `Deleted vendor ID: ${id}` });
        return id;
      } catch (error) {
        log('deleteVendor Mutation Error', error);
        ThrowError('Failed to delete vendor.');
      }
    },

    async createAccountingYear(_, { company_id, name, start_date, end_date }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['createAccountingYear'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.string(name)) { ThrowError('Invalid name.'); }
      if (!Validate.date(start_date)) { ThrowError('Invalid start date.'); }
      if (!Validate.date(end_date)) { ThrowError('Invalid end date.'); }

      try {
        const yearData = { company_id, name, start_date, end_date };
        const insertId = await DBObject.insertOne('accounting_year', yearData);
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'createAccountingYear', details: `Created accounting year: ${name}` });
        return insertId;
      } catch (error) {
        log('createAccountingYear Mutation Error', error);
        ThrowError('Failed to create accounting year.');
      }
    },

    async updateAccountingYear(_, { id, company_id, name, start_date, end_date }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateAccountingYear'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid year ID.'); }
      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.string(name)) { ThrowError('Invalid name.'); }
      if (!Validate.date(start_date)) { ThrowError('Invalid start date.'); }
      if (!Validate.date(end_date)) { ThrowError('Invalid end date.'); }

      try {
        const updatedData = { name, start_date, end_date };
        await DBObject.updateOne('accounting_year', updatedData, { id, company_id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'updateAccountingYear', details: `Updated accounting year ID: ${id}` });
        return id;
      } catch (error) {
        log('updateAccountingYear Mutation Error', error);
        ThrowError('Failed to update accounting year.');
      }
    },

    async closeAccountingYear(_, { id, company_id, new_accounting_year_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['closeAccountingYear'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(id)) { ThrowError('Invalid year ID.'); }
      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(new_accounting_year_id)) { ThrowError('Invalid new accounting year ID.'); }

      try {
        await DBObject.updateOne('accounting_year', { status: 'CLOSED' }, { id, company_id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'closeAccountingYear', details: `Closed accounting year ID: ${id}` });
        return id;
      } catch (error) {
        log('closeAccountingYear Mutation Error', error);
        ThrowError('Failed to close accounting year.');
      }
    },

    async deleteAccountingYear(_, { id, company_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deleteAccountingYear'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.positiveInteger(id)) { ThrowError('Invalid year ID.'); }

      try {
        await DBObject.deleteOne('accounting_year', { id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'deleteAccountingYear', details: `Deleted accounting year ID: ${id}` });
        return id;
      } catch (error) {
        log('deleteAccountingYear Mutation Error', error);
        ThrowError('Failed to delete accounting year.');
      }
    },

    async postTransaction(_, { company_id, branch_id, source, destination, value_date, remarks }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['postTransaction'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.array(source) || !Validate.array(destination)) { ThrowError('Invalid transaction components.'); }

      // Transaction logic would be here, this assumes it handles batch transactions
      try {
        const transactionData = { company_id, branch_id, value_date, remarks };
        // Assuming you will handle transaction creation logic
        const transactionId = await DBObject.insertOne('transactions', transactionData);
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'postTransaction', details: `Posted transaction ID: ${transactionId}` });
        return transactionId;
      } catch (error) {
        log('postTransaction Mutation Error', error);
        ThrowError('Failed to post transaction.');
      }
    },

    async deleteTransaction(_, { company_id, branch_id, id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deleteTransaction'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(id)) { ThrowError('Invalid transaction ID.'); }

      try {
        await DBObject.deleteOne('transactions', { id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'deleteTransaction', details: `Deleted transaction ID: ${id}` });
        return 'Transaction deleted successfully.';
      } catch (error) {
        log('deleteTransaction Mutation Error', error);
        ThrowError('Failed to delete transaction.');
      }
    },

    async createPayroll(_, { company_id, branch_id, name, schedule }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['createPayroll'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.string(name)) { ThrowError('Invalid name.'); }
      if (!Validate.array(schedule)) { ThrowError('Invalid schedule.'); }

      try {
        const payrollData = { company_id, branch_id, name, schedule: JSON.stringify(schedule) };
        const insertId = await DBObject.insertOne('payrolls', payrollData);
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'createPayroll', details: `Created payroll: ${name}` });
        return insertId;
      } catch (error) {
        log('createPayroll Mutation Error', error);
        ThrowError('Failed to create payroll.');
      }
    },

    async updatePayroll(_, { id, company_id, branch_id, name, schedule }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['updatePayroll'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(id)) { ThrowError('Invalid payroll ID.'); }
      if (!Validate.integer(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.string(name)) { ThrowError('Invalid name.'); }
      if (!Validate.array(schedule)) { ThrowError('Invalid schedule.'); }

      try {
        const updatedData = { name, schedule: JSON.stringify(schedule) };
        await DBObject.updateOne('payrolls', updatedData, { id, company_id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'updatePayroll', details: `Updated payroll ID: ${id}` });
        return id;
      } catch (error) {
        log('updatePayroll Mutation Error', error);
        ThrowError('Failed to update payroll.');
      }
    },

    async deletePayroll(_, { id, company_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deletePayroll'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(id)) { ThrowError('Invalid payroll ID.'); }

      try {
        await DBObject.deleteOne('payrolls', { id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'deletePayroll', details: `Deleted payroll ID: ${id}` });
        return id;
      } catch (error) {
        log('deletePayroll Mutation Error', error);
        ThrowError('Failed to delete payroll.');
      }
    },

    async postPayrollLiability(_, { company_id, branch_id, payroll_id, header_name }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['postPayrollLiability'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.integer(payroll_id)) { ThrowError('Invalid payroll ID.'); }
      if (!Validate.string(header_name)) { ThrowError('Invalid header name.'); }

      try {
        const insertId = await DBObject.insertOne('payroll_liabilities', { company_id, branch_id, payroll_id, header_name });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'postPayrollLiability', details: `Posted payroll liability for ${header_name}` });
        return insertId;
      } catch (error) {
        log('postPayrollLiability Mutation Error', error);
        ThrowError('Failed to post payroll liability.');
      }
    },

    async postPayrollExpense(_, { company_id, branch_id, payroll_id, header_name, bank_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['postPayrollExpense'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(company_id)) { ThrowError('Invalid company.'); }
      if (!Validate.integer(branch_id)) { ThrowError('Invalid branch.'); }
      if (!Validate.integer(payroll_id)) { ThrowError('Invalid payroll ID.'); }
      if (!Validate.string(header_name)) { ThrowError('Invalid header name.'); }
      if (!Validate.integer(bank_id)) { ThrowError('Invalid bank ID.'); }

      try {
        const insertId = await DBObject.insertOne('payroll_expenses', { company_id, branch_id, payroll_id, header_name, bank_id });
        SaveAuditTrail({ user_id: context.id, email: context.email, company_id, task: 'postPayrollExpense', details: `Posted payroll expense for ${header_name}` });
        return insertId;
      } catch (error) {
        log('postPayrollExpense Mutation Error', error);
        ThrowError('Failed to post payroll expense.');
      }
    },
  },
};