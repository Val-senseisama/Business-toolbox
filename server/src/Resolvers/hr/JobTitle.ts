import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
// import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";


export default {
  Query: {
    async getAllJobTitles(_, { company_id, offset }, context: Record<string, any>) {
      if(!context.id){
        ThrowError("#RELOGIN")
      };
      if(!Validate.integer(company_id)){
        ThrowError("Invalid company.")
      };
      if (!hasPermission({ context, company_id, tasks: ["GET_ALL_JOB_TITLES"] })) {
        ThrowError("NO ACCESS.")
      }
      const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
      const calculatedOffset = offset * pageSize;
      const query = `
              SELECT id, name, description, created_at, updated_at
              FROM hr_job_titles
              WHERE company_id = :company_id
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
          company_id,
          task: "GET_ALL_JOB_TITLES",
          details: `Retrieved job titles for company ${company_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error) => {
          ThrowError(error.message)
        })
        return results;
      
      } catch (error) {
        ThrowError("Failed to fetch job titles");
      }
    }
  },
  Mutation: {
    async createJobTitle(_, { company_id, name, description }, context: Record<string, any>) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company. Please enter a valid company number.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      };
      if (!Validate.string(description)) {
        ThrowError("Invalid description.");
      };
      if (!hasPermission({ context, company_id, tasks: ["CREATE_JOB_TITLE"] })) {
        ThrowError("NO ACCESS.")
      }

      const data = {
        company_id,
        name,
        description
      };
      try {
        const insertedId = await DBObject.insertOne('hr_job_titles', data);
        if (!insertedId) {
          ThrowError('Failed to create JobTitle.');
        }

       SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id,
          task: "CREATE_JOB_TITLE",
          details: `Created job title: ${name}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error)=>{
          ThrowError(error)
        });
        return insertedId;
      } catch (error) {
        ThrowError("Failed to insert JobTitle.");
      }
    },
    async updateJobTitle(_, { id, company_id, name, description }, context: Record<string, any>) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      if (!Validate.integer(company_id)) {
        ThrowError("Invalid company.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      };
      if (!Validate.string(description)) {
        ThrowError("Invalid description.");
      };
      if (!hasPermission({ context, company_id, tasks: ["UPDATE_JOB_TITLE"] })) {
        ThrowError("NO ACCESS.")
      }
      const updatedData = {
        company_id,
        name,
        description
      };
      try {
        const updatedID = await DBObject.updateOne("hr_job_titles", updatedData, { id });
        SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id,
          task: "UPDATE_JOB_TITLE",
          details: `Updated job title: ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error)=>{
          ThrowError(error);
        })
        return updatedID;
      } catch (error) {
        ThrowError("Error updating job titles");
      }
    },

    async deleteJobTitle(_, { id }, context: Record<string, any>) {
      if (!Validate.integer(id)) {
        ThrowError("Invalid ID.")
      };
      try {
        const jobTitleToDelete = await DBObject.findOne("hr_job_titles", { id });
        if (!jobTitleToDelete) {
          ThrowError("Job title not found")
        };
        if (!hasPermission({ context, company_id: jobTitleToDelete.company_id, tasks: ["DELETE_JOB_TITLE"] })) {
          ThrowError("NO ACCESS.")
        }
        const deletedID = await DBObject.deleteOne("hr_job_titles", { id });
        SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: jobTitleToDelete.company_id,
          task: "DELETE_JOB_TITLE",
          details: `Deleted job title: ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        }).catch((error) => {
          ThrowError(error)
        });
        return deletedID;
      } catch (error) {
        ThrowError("Error deleting job title");
      }
    }
  }
};