import { ThrowError, SaveAuditTrail } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import CONFIG from "../../config/config.js";
import hasPermission from "../../Helpers/hasPermission.js";

export default {
  Query: {
    async getMyCompanies(_, __, context: Record<string, any>) {
      if (!context || !context.id) {
        ThrowError("#RELOGIN");
      }

      try {
        const userCompanies = await DBObject.findMany("user_company", {
          user_id: context.id,
        });
        if (!userCompanies || userCompanies.length === 0) {
          return [];
        }

        const companyIds = userCompanies.map((uc) => uc.company_id);
        if (!companyIds || companyIds.length === 0) {
          return [];
        }

        const placeholders = companyIds.map(() => "?").join(",");
        const query = `SELECT * FROM companies WHERE id IN (?)`;
        const companies = await DBObject.findDirect(query, [companyIds]);

        if (!companies || companies.length === 0) {
          return [];
        }

        return companies.map((company) => ({
          id: company.id,
          name: company.name,
          about: company.about,
          address: company.address,
          city: company.city,
          state: company.state,
          country: company.country,
          phone: company.phone,
          email: company.email,
          website: company.website,
          logo: company.logo,
        }));
      } catch (error) {
        ThrowError("Failed fetching user companies.");
      }
    },

    async getFullCompanyProfile(
      _,
      { company_id },
      context: Record<string, any>
    ) {
      if (!context || !context.id) {
        ThrowError("#RELOGIN");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company.");
      }

      try {
        const company = await DBObject.findOne("companies", { id: company_id });
        if (!company) {
          ThrowError("Company not found.");
        }

        return {
          ...company,
          settings: JSON.parse(company.settings),
        };
      } catch (error) {
        ThrowError("Failed fetching company's profile.");
      }
    },

    async getUsersLinkedToMyCompany(
      _,
      { company_id, offset }: { company_id: number; offset: number },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company.");
      }

      try {
        const query = `
          SELECT id, email, first_name, last_name
          FROM users
          WHERE id IN (SELECT user_id FROM user_company WHERE company_id = ?)
          ORDER BY id
          LIMIT ? OFFSET ?
        `;

        const params = [company_id, CONFIG.settings.PAGINATION_LIMIT, offset];
        const results = await DBObject.findDirect(query, params);

        if (!results) {
          ThrowError("Users not found.");
        }

        return results.map((user) => ({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          title: user.title,
          phone: user.phone,
        }));
      } catch (error) {
        ThrowError("Failed fetching users linked to company.");
      }
    },

    getAllCompanyBranches: async (
      _,
      { company_id, offset },
      context: Record<string, any>
    ) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company.");
      }

      try {
        const query = `
          SELECT id, name, settings, created_at, updated_at
          FROM branches
          WHERE company_id = ?
          ORDER BY id
          LIMIT ? OFFSET ?
        `;

        const params = [company_id, CONFIG.settings.PAGINATION_LIMIT, offset];
        const results = await DBObject.findDirect(query, params);

        if (!results) {
          ThrowError("Company branches not found.");
        }

        return results.map((branch) => ({
          id: branch.id,
          name: branch.name,
          settings: JSON.parse(branch.settings),
        }));
      } catch (error) {
        ThrowError("Failed fetching company's branches.");
      }
    },

    async getAllCompanyUsers(
      _,
      { company_id, offset }: { company_id: number; offset: number },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      try {
        const query = `
          SELECT id, email, first_name, last_name
          FROM users
          WHERE id IN (SELECT user_id FROM user_company WHERE company_id = ?)
          ORDER BY id
          LIMIT ? OFFSET ?
        `;

        const params = [company_id, CONFIG.settings.PAGINATION_LIMIT, offset];
        const results = await DBObject.findDirect(query, params);

        if (!results) {
          ThrowError("Company users not found");
        }

        return results.map((user) => ({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          title: user.title,
          phone: user.phone,
        }));
      } catch (error) {
        ThrowError("Failed fetching company's users.");
      }
    },

    async getMyPendingCompanyLinks(_, __, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      try {
        const pendingLinks = await DBObject.findMany("user_company", {
          user_id: context.id,
          status: "PENDING",
        });

        if (!pendingLinks || pendingLinks.length === 0) {
          return [];
        }

        const companyIds = pendingLinks.map((pl) => pl.company_id);

        if (!companyIds || companyIds.length === 0) {
          ThrowError("Company not found.");
        }

        const companies = await DBObject.findMany("companies", {
          id: { in: companyIds },
        });

        if (!companies) {
          ThrowError("Companies not found");
        }

        return companies.map((company) => ({
          id: company.id,
          name: company.name,
          about: company.about,
          logo: company.logo,
          address: company.address,
          email: company.email,
          website: company.website,
          city: company.city,
          state: company.state,
          country: company.country,
          phone: company.phone,
        }));
      } catch (error) {
        ThrowError("Failed fetching pending company's links");
      }
    },
  },

  Mutation: {
    async createCompany(
      _,
      {
        name,
        about,
        address,
        city,
        state,
        country,
        phone,
        email,
        website,
        industry,
        logo,
        settings,
      },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({ context, company_id: 0, tasks: ["CREATE_COMPANY"] })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid company name.");
      }
      if (!Validate.string(about)) {
        ThrowError("Invalid about.");
      }
      if (!Validate.string(address)) {
        ThrowError("Invalid address.");
      }
      if (!Validate.string(city)) {
        ThrowError("Invalid city.");
      }
      if (!Validate.string(state)) {
        ThrowError("Invalid state.");
      }
      if (!Validate.string(country)) {
        ThrowError("Invalid country.");
      }
      if (!Validate.phone(phone)) {
        ThrowError("Invalid phone number.");
      }
      if (!Validate.email(email)) {
        ThrowError("Invalid email.");
      }
      if (!Validate.URL(website)) {
        ThrowError("Invalid website URL.");
      }
      if (!Validate.string(industry)) {
        ThrowError("Invalid industry.");
      }
      if (!Validate.URL(logo)) {
        ThrowError("Invalid logo URL.");
      }
      if (!Validate.object(settings)) {
        ThrowError("Invalid settings.");
      }

      try {
        const newCompany = {
          name,
          about,
          address,
          city,
          state,
          country,
          phone,
          email,
          website,
          industry,
          logo,
          settings: JSON.stringify(settings),
        };
        const companyId = await DBObject.insertOne("companies", newCompany);

        if (!companyId) {
          ThrowError("Failed to create company.");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id: companyId,
          branch_id: 0,
          email: context.email,
          task: "CREATE_COMPANY",
          details: `Created company: ${name}`,
        });

        return {
          ...newCompany,
          id: companyId,
          settings: JSON.parse(newCompany.settings),
        };
      } catch (error) {
        ThrowError("Failed to create company.");
      }
    },

    async updateCompany(
      _,
      {
        id,
        name,
        about,
        address,
        city,
        state,
        country,
        phone,
        email,
        website,
        industry,
        logo,
        settings,
      },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({ context, company_id: id, tasks: ["UPDATE_COMPANY"] })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid company name.");
      }
      if (!Validate.string(about)) {
        ThrowError("Invalid about.");
      }
      if (!Validate.string(address)) {
        ThrowError("Invalid address.");
      }
      if (!Validate.string(city)) {
        ThrowError("Invalid city.");
      }
      if (!Validate.string(state)) {
        ThrowError("Invalid state.");
      }
      if (!Validate.string(country)) {
        ThrowError("Invalid country.");
      }
      if (!Validate.phone(phone)) {
        ThrowError("Invalid phone number.");
      }
      if (!Validate.email(email)) {
        ThrowError("Invalid email.");
      }
      if (!Validate.URL(website)) {
        ThrowError("Invalid website URL.");
      }
      if (!Validate.string(industry)) {
        ThrowError("Invalid industry.");
      }
      if (!Validate.URL(logo)) {
        ThrowError("Invalid logo URL.");
      }
      if (!Validate.object(settings)) {
        ThrowError("Invalid settings.");
      }

      try {
        const updateData: any = { updated_at: DateTime.now().toSQL() };
        if (name) updateData.name = name;
        if (about) updateData.about = about;
        if (address) updateData.address = address;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (country) updateData.country = country;
        if (phone) updateData.phone = phone;
        if (email) updateData.email = email;
        if (website) updateData.website = website;
        if (industry) updateData.industry = industry;
        if (logo) updateData.logo = logo;
        if (settings) updateData.settings = JSON.stringify(settings);

        let updated = 0;
        try {
          updated = await DBObject.updateOne("companies", updateData, { id });
        } catch (error) {
          ThrowError("Failed to update company.");
        }

        if (updated < 1) {
          ThrowError("No changes made to company.");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id: id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "UPDATE_COMPANY",
          details: `Updated company with ID: ${id}`,
        });

        return updated;
      } catch (error) {
        ThrowError("Failed to update company.");
      }
    },

    async deleteCompany(_, { id }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({ context, company_id: id, tasks: ["DELETE_COMPANY"] })
      ) {
        ThrowError("#NOACCESS");
      }

      try {
        let deleted = 0;
        try {
          deleted = await DBObject.deleteOne("companies", { id });
        } catch (error) {
          ThrowError("Failed to delete company.");
        }

        if (deleted < 1) {
          ThrowError("Company not found or already deleted.");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id: id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "DELETE_COMPANY",
          details: `Deleted company with ID: ${id}`,
        });

        return id;
      } catch (error) {
        ThrowError("Failed to delete company.");
      }
    },

    async addUserToCompany(
      _,
      { email, company_id },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({
          context,
          company_id,
          tasks: ["ADD_USER_TO_COMPANY"],
        })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.email(email)) {
        ThrowError("Invalid email.");
      }

      try {
        const user = await DBObject.findOne("users", { email });
        if (!user) {
          ThrowError("User not found.");
        }

        let inserted = 0;
        try {
          inserted = await DBObject.insertOne("user_company", {
            user_id: user.id,
            company_id,
            email,
            role_type: "STAFF",
            status: "PENDING",
          });
        } catch (error) {
          ThrowError("Failed to add user to company.");
        }

        if (inserted < 1) {
          ThrowError("Failed to add user to company.");
        }

        await SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          task: "ADD_USER_TO_COMPANY",
          details: `Added user ${email} to company ${company_id}`,
        });

        return {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          title: user.title,
          phone: user.phone,
        };
      } catch (error) {
        ThrowError("Failed to add user to company.");
      }
    },

    async removeUserFromCompany(
      _,
      { user_company_id, email, company_id },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({
          context,
          company_id,
          tasks: ["REMOVE_USER_FROM_COMPANY"],
        })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(user_company_id)) {
        ThrowError("Invalid user company ID");
      }

      if (!Validate.email(email)) {
        ThrowError("Invalid email");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      try {
        let deleted = 0;
        try {
          deleted = await DBObject.deleteOne("user_company", {
            id: user_company_id,
          });
        } catch (error) {
          ThrowError("Failed to remove user from company");
        }

        if (deleted < 1) {
          ThrowError("User company record not found or already removed");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "REMOVE_USER_FROM_COMPANY",
          details: `Removed user ${email} from company ${company_id}`,
        });

        return deleted;
      } catch (error) {
        ThrowError("Failed to remove user from company");
      }
    },

    async createCompanyBranch(
      _,
      { company_id, name, settings },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({
          context,
          company_id,
          tasks: ["CREATE_COMPANY_BRANCH"],
        })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid branch name");
      }

      if (!Validate.object(settings)) {
        ThrowError("Invalid settings");
      }

      try {
        const newBranch = {
          company_id,
          name,
          settings: JSON.stringify(settings),
        };

        let branchId = 0;
        try {
          branchId = await DBObject.insertOne("branches", newBranch);
        } catch (error) {
          ThrowError("Failed to create company branch");
        }

        if (branchId < 1) {
          ThrowError("Failed to create company branch");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: branchId,
          email: context.email,
          task: "CREATE_COMPANY_BRANCH",
          details: `Created branch ${name} for company ${company_id}`,
        });

        return {
          id: branchId,
          name: newBranch.name,
          settings: JSON.parse(newBranch.settings),
        };
      } catch (error) {
        ThrowError("Failed to create company branch");
      }
    },

    async deleteCompanyBranch(
      _,
      { company_id, branch_id },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({
          context,
          company_id,
          tasks: ["UPDATE_COMPANY_BRANCH"],
        })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      if (!Validate.integer(branch_id)) {
        ThrowError("Invalid branch ID");
      }

      try {
        let deleted = 0;
        try {
          deleted = await DBObject.deleteOne("branches", {
            id: branch_id,
            company_id,
          });
        } catch (error) {
          ThrowError("Failed to delete company branch");
        }

        if (deleted < 1) {
          ThrowError("Branch not found or already deleted");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "DELETE_COMPANY_BRANCH",
          details: `Deleted branch ${branch_id} from company ${company_id}`,
        });

        return branch_id;
      } catch (error) {
        ThrowError("Failed to delete company branch");
      }
    },

    async updateCompanyBranch(
      _,
      { company_id, branch_id, name, settings },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({
          context,
          company_id,
          tasks: ["UPDATE_COMPANY_BRANCH"],
        })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      if (!Validate.integer(branch_id)) {
        ThrowError("Invalid branch ID");
      }

      if (name && !Validate.string(name)) {
        ThrowError("Invalid branch name");
      }

      if (settings && !Validate.object(settings)) {
        ThrowError("Invalid settings");
      }

      try {
        const updateData: any = {};
        if (name) updateData.name = name;
        if (settings) updateData.settings = JSON.stringify(settings);

        let updated = 0;
        try {
          updated = await DBObject.updateOne("branches", updateData, {
            id: branch_id,
            company_id,
          });
        } catch (error) {
          ThrowError("Failed to update company branch");
        }

        if (updated < 1) {
          ThrowError("No changes made to company branch");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "UPDATE_COMPANY_BRANCH",
          details: `Updated branch ${branch_id} for company ${company_id}`,
        });

        return updated;
      } catch (error) {
        ThrowError("Failed to update company branch");
      }
    },

    async acceptPendingCompanyLink(
      _,
      { user_company_id, company_id },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!Validate.integer(user_company_id)) {
        ThrowError("Invalid user company ID");
      }

      try {
        let updated = 0;
        try {
          updated = await DBObject.updateOne(
            "user_company",
            { status: "ACTIVE" },
            { id: user_company_id, company_id, user_id: context.id }
          );
        } catch (error) {
          ThrowError("Failed to accept pending company link");
        }

        if (updated < 1) {
          ThrowError("No pending company link found or already accepted");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "ACCEPT_COMPANY_LINK",
          details: `Accepted pending link for company ${company_id}`,
        });

        const companyData = await DBObject.findOne("companies", {
          id: company_id,
        });
        if (!companyData) {
          ThrowError("Company not found");
        }

        return {
          id: companyData.id,
          name: companyData.name,
          about: companyData.about,
          logo: companyData.logo,
          address: companyData.address,
          email: companyData.email,
          website: companyData.website,
          city: companyData.city,
          state: companyData.state,
          country: companyData.country,
          phone: companyData.phone,
        };
      } catch (error) {
        ThrowError("Failed to accept pending company's link.");
      }
    },

    updateCompanySettings: async (
      _,
      { company_id, settings },
      context: Record<string, any>
    ) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({
          context,
          company_id,
          tasks: ["UPDATE_COMPANY_SETTINGS"],
        })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      if (!Validate.object(settings)) {
        ThrowError("Invalid settings");
      }

      try {
        const updatedSettings = JSON.stringify(settings);
        let updated = 0;
        try {
          updated = await DBObject.updateOne(
            "companies",
            { settings: updatedSettings },
            { id: company_id }
          );
        } catch (error) {
          ThrowError("Failed to update company settings");
        }

        if (updated < 1) {
          ThrowError("No changes made to company settings");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "UPDATE_COMPANY_SETTINGS",
          details: `Updated settings for company ${company_id}`,
        });

        return settings;
      } catch (error) {
        ThrowError("Failed to update company settings");
      }
    },
  },
};
