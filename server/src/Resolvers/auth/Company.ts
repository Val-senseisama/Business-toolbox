
import { ThrowError, SaveAuditTrail } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
  Query: {
    getMyCompanies: async (_, __, context) => {
      if (!context || !context.id) {
        ThrowError("#RELOGIN");
      }
      const userCompanies = await DBObject.findMany("user_company", { user_id: context.id });
      if (!userCompanies) {
        ThrowError("#USER_COMPANIES_NOT_FOUND");
      }
      const companyIds = userCompanies.map(uc => uc.company_id);
      
      if (!companyIds || companyIds.length === 0) {
        ThrowError("#USER_COMPANY_IDS_NOT_FOUND");
      }

      const companies = await DBObject.findMany("companies", { id: { $in: companyIds } });
      if (!companies) {
        ThrowError("#COMPANIES_NOT_FOUND");
      }

      return companies;
    },
    getFullCompanyProfile: async (_, { company_id }, context) => {
      if (!context || !context.id) {
        ThrowError("#RELOGIN");
      }
      const company = await DBObject.findOne("companies", { id: company_id });
      if (!company) {
        ThrowError("#COMPANY_NOT_FOUND");
      }
      if (!company.settings) {
        ThrowError("#COMPANY_SETTINGS_NOT_FOUND");
      }
      return {
        ...company,
        settings: JSON.parse(company.settings)
      };
    },
    getUsersLinkedToMyCompany: async (_, { company_id, offset }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const query = `
        SELECT u.id, u.email, u.first_name, u.last_name
        FROM user_company uc
        JOIN users u ON uc.user_id = u.id
        WHERE uc.company_id = :company_id
        ORDER BY u.id
        LIMIT 10 OFFSET :offset
      `;
      
      const params = {
        company_id: company_id,
        offset: offset
      };
      
      return await DBObject.findDirect(query, params);
    },
    getAllCompanyBranches: async (_, { company_id, offset }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const query = `
        SELECT id, name, settings, created_at, updated_at
        FROM branches
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
    getAllCompanyUsers: async (_, { company_id, offset }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const query = `
        SELECT u.id, u.email, u.first_name, u.last_name
        FROM user_company uc
        JOIN users u ON uc.user_id = u.id
        WHERE uc.company_id = :company_id
        ORDER BY u.id
        LIMIT 10 OFFSET :offset
      `;
      
      const params = {
        company_id: company_id,
        offset: offset
      };
      
      return await DBObject.findDirect(query, params);
    },
    getMyPendingCompanyLinks: async (_, __, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const pendingLinks = await DBObject.findMany("user_company", { user_id: context.id, status: "PENDING" });
      const companyIds = pendingLinks.map(pl => pl.company_id);
      return await DBObject.findMany("companies", { id: { $in: companyIds } });
    }
  },
  Mutation: {
    createCompany: async (_, { name, about, address, city, state, country, phone, email, website, industry, logo, settings }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const newCompany = {
        name, about, address, city, state, country, phone, email, website, industry, logo,
        settings: JSON.stringify(settings),
      };
      const companyId = await DBObject.insertOne("companies", newCompany);
      
      await SaveAuditTrail({
        user_id: context.id,
        company_id: companyId,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'CREATE_COMPANY',
        details: `Created company: ${name}`
      });
      
      return await DBObject.findOne("companies", { id: companyId });
    },
    updateCompany: async (_, { id, ...updateData }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      if (updateData.settings) {
        updateData.settings = JSON.stringify(updateData.settings);
      }
      updateData.updated_at = DateTime.now().toUTC().toISO();
      await DBObject.updateOne("companies", updateData, { id });
      
      await SaveAuditTrail({
        user_id: context.id,
        company_id: id,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'UPDATE_COMPANY',
        details: `Updated company with ID: ${id}`
      });
      
      return await DBObject.findOne("companies", { id });
    },
    deleteCompany: async (_, { id }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      await DBObject.deleteOne("companies", { id });
      
      await SaveAuditTrail({
        user_id: context.id,
        company_id: id,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'DELETE_COMPANY',
        details: `Deleted company with ID: ${id}`
      });
      
      return id;
    },
    addUserToCompany: async (_, { email, company_id }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const user = await DBObject.findOne("users", { email });
      if (!user) {
        ThrowError("#USER_NOT_FOUND");
      }
      await DBObject.insertOne("user_company", {
        user_id: user.id,
        company_id,
        email,
        role_type: 'STAFF',
        status: 'PENDING'
      });
      
      await SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'ADD_USER_TO_COMPANY',
        details: `Added user ${email} to company ${company_id}`
      });
      
      return user;
    },
    removeUserFromCompany: async (_, { user_company_id, email, company_id }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      await DBObject.deleteOne("user_company", { id: user_company_id });
      await SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'REMOVE_USER_FROM_COMPANY',
        details: `Removed user ${email} from company ${company_id}`
      });
      return await DBObject.findOne("users", { email });
    },
    createCompanyBranch: async (_, { company_id, name, settings }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const newBranch = {
        company_id,
        name,
        settings: JSON.stringify(settings),
      };
      const branchId = await DBObject.insertOne("branches", newBranch);

      await SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id: branchId,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'CREATE_COMPANY_BRANCH',
        details: `Created branch ${name} for company ${company_id}`
      });
      return await DBObject.findOne("branches", { id: branchId });
    },
    deleteCompanyBranch: async (_, { company_id, branch_id }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      await DBObject.deleteOne("branches", { id: branch_id, company_id });

      await SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'DELETE_COMPANY_BRANCH',
        details: `Deleted branch ${branch_id} from company ${company_id}`
      });
      return branch_id;
    },
    updateCompanyBranch: async (_, { company_id, branch_id, name, settings }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const updateData = {
        name,
        settings: JSON.stringify(settings),
      };
      await DBObject.updateOne("branches", updateData, { id: branch_id, company_id });


      await SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'UPDATE_COMPANY_BRANCH',
        details: `Updated branch ${branch_id} for company ${company_id}`
      });
      return await DBObject.findOne("branches", { id: branch_id });
    },
    acceptPendingCompanyLink: async (_, { user_company_id, company_id }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      await DBObject.updateOne("user_company", { status: "ACTIVE" }, { id: user_company_id, company_id, user_id: context.id });

      await SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'ACCEPT_COMPANY_LINK',
        details: `Accepted pending link for company ${company_id}`
      });
      return await DBObject.findOne("companies", { id: company_id });
    },
    updateCompanySettings: async (_, { company_id, settings }, context) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const updatedSettings = JSON.stringify(settings);
      await DBObject.updateOne("companies", { settings: updatedSettings }, { id: company_id });
      
      await SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id: 0,
        email: context.email,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: 'UPDATE_COMPANY_SETTINGS',
        details: `Updated settings for company ${company_id}`
      });
      return settings;
    }
  }
};
