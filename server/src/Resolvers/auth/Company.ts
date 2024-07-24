import { ThrowError, SaveAuditTrail } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import CONFIG from "../../config/config.js";
import hasPermission from "../../Helpers/hasPermission.js";
import { setEngine } from "crypto";

const getCompany = async (id: number, full = false) => {
  const company = await DBObject.findOne(
    "companies",
    { id },
    {
      columns: [
        "id", "name", "about", "address", "city", "state", "country",
        "phone", "email", "website", "industry", "logo", "settings",
        "plan", "plan_expiry", "created_at", "updated_at"
      ].join(", ")
    }
  );

  if (!company) {
    ThrowError("Company not found");
  }

  let settings = {};
  if (company.settings) {
    try {
      settings = JSON.parse(company.settings);
    } catch (err) {
      settings = {};
    }
  }

  let accountingYear = null;
  if (full) {
    accountingYear = await DBObject.findOne(
      "accounting_year",
      { company_id: id, status: 'ACTIVE' },
      { columns: "id, name, start_date, end_date" }
    );
  }

  return {
    ...company,
    settings,
    accounting_year_id: accountingYear ? accountingYear.id : 0
  };
};

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

        let companies = [];
        try {
          companies = await Promise.all(
            companyIds.map((id) => getCompany(id, true))
          );
        } catch (error) {
          ThrowError("Failed fetching user companies.");
        }

        return companies;
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
        return await getCompany(company_id, true);
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

      if (!hasPermission({ context, company_id, tasks: ["manage_users"] })) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }

      try {
        let user_ids;
        if(!offset){
          user_ids = await DBObject.findMany("user_company", { company_id: company_id });
        }else{
          offset = offset * CONFIG.settings.PAGINATION_LIMIT;
          user_ids = await DBObject.findDirect(`SELECT id, user_id FROM user_company WHERE company_id = :company_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, { company_id: company_id});
        }
        if (!user_ids) {
          return [];
        }

        let userBasic = [];
        try {
          for(const user_id of user_ids){
            userBasic.push(await DBObject.findOne("users", { id: user_id.user_id }));
          }
        } catch (error) {
          return []
        }

        return userBasic;
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

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      let branches;
      try{
        if(!offset){
          branches = await DBObject.findMany("branches", { company_id: company_id });
        }else{
          offset = offset * CONFIG.settings.PAGINATION_LIMIT;
          branches = await DBObject.findDirect(`SELECT * FROM branches WHERE company_id = :company_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, { company_id: company_id });
        }

      }catch(error){
        
        ThrowError("Failed fetching company's branches.");
      }
      if(branches.length === 0){
        return []
      }
      return branches;
    },

    async getAllCompanyUsers(
      _,
      { company_id, offset }: { company_id: number; offset: number },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ["manage_users"] })) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      
      try {
        let user_ids;
        if(!offset){
          user_ids = await DBObject.findMany("user_company", { company_id: company_id });
        }else{
          offset = offset * CONFIG.settings.PAGINATION_LIMIT;
          user_ids = await DBObject.findDirect(`SELECT id, user_id FROM user_company WHERE company_id = :company_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`, { company_id: company_id});
        }
        if (!user_ids) {
          return [];
        }

        let userBasic = [];
        try {
          for(const user_id of user_ids){
            userBasic.push(await DBObject.findOne("users", { id: user_id.user_id }));
          }
        } catch (error) {
          return []
        }

        return userBasic;
      } catch (error) {
        ThrowError("Failed fetching users linked to company.");
      }
    },

    async getMyPendingCompanyLinks(_, __, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      try {
        const pendingLinks = await DBObject.findMany("user_company",{ user_id: context.id, status: "PENDING" }, { columns: "company_id" });

        if (!pendingLinks || pendingLinks.length === 0) {
          return [];
        }

        const companyIds = pendingLinks.map((pl) =>
          getCompany(pl.company_id, true)
        );
        let result = await Promise.all(companyIds);
        return result;
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
      await DBObject.transaction();
      let companyId: number;
      try {
        companyId = await DBObject.insertOne("companies", newCompany);
        if (!Validate.positiveInteger(companyId)) {
          await DBObject.rollback();
          ThrowError("Failed to create company.");
        }

        await DBObject.insertOne("user_company", {
          company_id: companyId,
          user_id: context.id,
          email: context.email,
          status: "ACTIVE",
          role_type: "OWNER",
        });
      } catch (error) {
        await DBObject.rollback();
        ThrowError("Failed to create company.");
      }
      await DBObject.commit();
      SaveAuditTrail({
        user_id: context.id,
        company_id: companyId,
        branch_id: 0,
        name: context.name,
        task: "CREATE_COMPANY",
        details: `Created company: ${name}`,
      }).catch((err) => {
        /*  */
      });
      let companyDetails;
      let accountYearId;
      try {
        companyDetails = await DBObject.findOne(
          "companies",
          { id: companyId },
          {
            columns:
              "id, name, about, address, city, state, country, phone, email, website, industry, logo, settings, plan, plan_expiry, created_at, updated_at",
          }
        );
        accountYearId = await DBObject.findOne(
          "accounting_year",
          { company_id: companyId },
          { columns: "id, name" }
        );
      } catch (error) {
        ;
        ThrowError("Failed to fetch company details.");
      }
      companyDetails = {
        ...companyDetails,
        accounting_year_id: accountYearId ? accountYearId.id : 0,
      };
      return companyDetails;
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
        !hasPermission({ context, company_id: id, tasks: ["manage_company"] })
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
        const updateData: Record<string, string> = {};
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
          name: context.name,
          task: "UPDATE_COMPANY",
          details: `Updated company with ID: ${id}. Changes made: ${JSON.stringify(
            updateData
          )}`,
        });

        let companyDetails;
        let accountYearId;
        try {
          companyDetails = await DBObject.findOne(
            "companies",
            { id: id },
            {
              columns:
                "id, name, about, address, city, state, country, phone, email, website, industry, logo, settings, plan, plan_expiry, created_at, updated_at",
            }
          );
          accountYearId = await DBObject.findOne(
            "accounting_year",
            { company_id: id },
            { columns: "id, name" }
          );
        } catch (error) {
          ;
          ThrowError("Failed to fetch company details.");
        }
        companyDetails = {
          ...companyDetails,
          accounting_year_id: accountYearId ? accountYearId.id : 0,
        };
        return companyDetails;
      } catch (error) {
        ThrowError("Failed to update company.");
      }
    },

    async deleteCompany(_, { id }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      const role_type = await DBObject.findOne(
        "user_company",
        { company_id: id, user_id: context.id },
        { columns: "role_type" }
      );

      if (role_type.role_type != "OWNER") {
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
          ThrowError("Failed to delete company.");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id: id,
          branch_id: 0,
          name: context.name,
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
      { email, company_id, branch_id },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ["manage_users"] })) {
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

        const user_company = await DBObject.findOne(
          "user_company",
          { company_id, email },
          { columns: "role_type, status" }
        );
        if (user_company && user_company.status) {
          ThrowError(
            `User already in company as ${user_company.status} ${user_company.role_type}.`
          );
        }

        let inserted = 0;
        try {
          inserted = await DBObject.insertOne("user_company", {
            user_id: 0,
            company_id,
            branch_id,
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
          branch_id,
          name: context.name,
          task: "ADD_USER_TO_COMPANY",
          details: `Added user ${email} to company ${company_id}`,
        });

        return user;
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

      if (!hasPermission({ context, company_id, tasks: ["manage_users"] })) {
        ThrowError("#NOACCESS");
      }

      if (
        !Validate.positiveInteger(user_company_id) &&
        !Validate.email(email)
      ) {
        ThrowError("Invalid user");
      }

      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company ID");
      }

      const param: Record<string, number | string> = { company_id };
      if (Validate.positiveInteger(user_company_id)) {
        param.id = user_company_id;
      } else if (Validate.email(email)) {
        param.email = email;
      } else {
        ThrowError("Invalid user");
      }

      try {
        let deleted = 0;
        try {
          deleted = await DBObject.deleteOne("user_company", param);
        } catch (error) {
          ThrowError("Failed to remove user from company");
        }

        if (deleted < 1) {
          ThrowError("User record not found or already removed");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
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
      { company_id, name, description, settings },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (
        !hasPermission({
          context,
          company_id,
          tasks: ["manage_company"],
        })
      ) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid branch name");
      }

      if (!Validate.object(settings)) {
        settings = {};
      }

      try {
        const newBranch = {
          company_id,
          name,
          description,
          settings: settings ? JSON.stringify(settings) : "{}",
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
          name: context.name,
          task: "CREATE_COMPANY_BRANCH",
          details: `Created branch ${name} for company ${company_id}`,
        });

        return {
          id: branchId,
          name: name,
          settings: settings ? JSON.parse(newBranch.settings) : {},
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

      if (!hasPermission({ context, company_id, tasks: ["manage_company"] })) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch ID");
      }
      let deleted = 0;
      let branch;
      try {
        branch = await DBObject.findOne("branches", {
          id: branch_id,
          company_id,
        });
        if (!branch) {
          ThrowError("Please select a valid branch.");
        }
        deleted = await DBObject.deleteOne("branches", {
          id: branch_id,
          company_id,
        });
      } catch (error) {
        ThrowError("Failed to delete company branch");
      }

      if (!Validate.positiveInteger(deleted)) {
        ThrowError("Could not delete company branch");
      }

      SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id,
        name: context.name,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: "DELETE_COMPANY_BRANCH",
        details: `Deleted branch ${branch.name} from company ${company_id}`,
      });

      return deleted;
    },

    async updateCompanyBranch(
      _,
      { company_id, branch_id, name, description, settings },
      context: Record<string, any>
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ["manage_company"] })) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company ID");
      }

      if (!Validate.positiveInteger(branch_id)) {
        ThrowError("Invalid branch ID");
      }

      if (!name && !Validate.string(name)) {
        ThrowError("Invalid branch name");
      }

      if (!settings && !Validate.object(settings)) {
        ThrowError("Invalid settings");
      }

      try {
        const updateData: any = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
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
          name: context.name,
          ip_address: context.ip,
          browser_agents: context.userAgent,
          task: "UPDATE_COMPANY_BRANCH",
          details: `Updated branch ${branch_id} for company ${company_id}`,
        });

        return {
          id: branch_id,
          name: name,
          settings: settings ? JSON.parse(updateData.settings) : {},
        };
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

      if (!Validate.positiveInteger(user_company_id)) {
        ThrowError("Invalid user link");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      let updated = 0;
      try {
        try {
          updated = await DBObject.updateOne(
            "user_company",
            { user_id: context.id, status: "ACTIVE" },
            {
              id: user_company_id,
              company_id,
              user_id: context.id,
              email: context.email,
            }
          );
        } catch (error) {
          ThrowError("Failed to accept pending company link");
        }

        if (!Validate.positiveInteger(updated)) {
          ThrowError("No pending company link found or already accepted");
        }
      } catch (error) {
        ThrowError("Failed to accept pending company's link.");
      }

      const companyData = await DBObject.findOne(
        "companies",
        { id: company_id },
        {
          columns:
            "id, name, about, address, city, state, country, phone, email, website, logo",
        }
      );
      const accounting_year_id = await DBObject.findOne(
        "accounting_year",
        { company_id, status: "ACTIVE" },
        { columns: "id, name, start_date, end_date" }
      );
      SaveAuditTrail({
        user_id: context.id,
        company_id,
        branch_id: 0,
        name: context.name,
        ip_address: context.ip,
        browser_agents: context.userAgent,
        task: "ACCEPT_COMPANY_LINK",
        details: `${context.name} accepted pending link for company ${companyData.name}`,
      });
      return {
        ...companyData,
        accounting_year_id: accounting_year_id ? accounting_year_id.id : 0,
      };
    },

    updateCompanySettings: async (
      _,
      { company_id, settings },
      context: Record<string, any>
    ) => {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }

      if (!hasPermission({ context, company_id, tasks: ["manage_company"] })) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
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

        if (!Validate.positiveInteger(updated)) {
          ThrowError("No changes made to company settings");
        }

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
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
