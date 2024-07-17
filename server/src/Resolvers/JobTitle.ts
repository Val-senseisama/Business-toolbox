import { SaveAuditTrail, ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
  Query: {
    async getAllJobTitles(_, { company_id, offset }, context) {
      const query = `
              SELECT id, name, description, created_at, updated_at
              FROM hr_job_titles
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
          task: "GET_ALL_JOB_TITLES",
          details: `Retrieved job titles for company ${company_id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });
       
        return results;
      } catch (error) {
        console.error("Error fetching job titles:", error);
        ThrowError("Failed to fetch job titles");
      }
    }
  },
  Mutation: {
    async createJobTitle(_, { company_id, name, description }, context) {
      if (!company_id) ThrowError("Invalid company");
      if (!name) ThrowError("Invalid name");

      const data = {
        company_id,
        name,
        description,
        created_at: DateTime.now().toUTC().toISO(),
        updated_at: DateTime.now().toUTC().toISO(),
      };
      try {
        const insertedId = await DBObject.insertOne('hr_job_titles', data);
        if (!insertedId) {
          ThrowError('Failed to create JobTitle');
        }

        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id,
          task: "CREATE_JOB_TITLE",
          details: `Created job title: ${name}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });
     
        return insertedId;
      } catch (error) {
        console.error("Error inserting JobTitle:", error);
        ThrowError("Failed to insert JobTitle");
      }
    },
    async updateJobTitle(_, { id, company_id, name, description }, context) {
      if (!company_id) ThrowError("Invalid company");
      if (!name) ThrowError("Invalid name");

      const updatedData = {
        company_id,
        name,
        description,
        updated_at: DateTime.now().toUTC().toISO()
      };
      try {
        const updatedID = await DBObject.updateOne("hr_job_titles", updatedData, { id });
      
        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id,
          task: "UPDATE_JOB_TITLE",
          details: `Updated job title: ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });
        return updatedID;
      } catch (error) {
        console.error("Error updating job titles:", error);
        ThrowError("Error updating job titles");
      }
    },
    async deleteJobTitle(_, { id }, context) {
      if (!id) ThrowError("Invalid ID");

      try {
        const jobTitleToDelete = await DBObject.findOne("hr_job_titles", { id });
        if (!jobTitleToDelete) ThrowError("Job title not found");

        const deletedID = await DBObject.deleteOne("hr_job_titles", { id });
        await SaveAuditTrail({
          user_id: context.id,
          email: context.email,
          branch_id: context.branch_id,
          company_id: jobTitleToDelete.company_id,
          task: "DELETE_JOB_TITLE",
          details: `Deleted job title: ${id}`,
          browser_agents: context.userAgent,
          ip_address: context.ip
        });
        return deletedID;
      } catch (error) {
        console.error("Error deleting job title:", error);
        ThrowError("Error deleting job title");
      }
    }
  }
};