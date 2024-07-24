import { log, SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
// import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";


export default {
  Query: {
    async getAllJobTitles(_, { company_id, offset }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      };

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("NO ACCESS.")
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.")
      };
      if(!Validate.positiveInteger(offset)){
        ThrowError("Invalid offset.")
      }
      const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
      const calculatedOffset = offset * pageSize;
      const query = `SELECT * FROM hr_job_titles
              WHERE company_id = :company_id LIMIT ${_CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
      const params = {
        company_id,
        limit: pageSize,
        offset: calculatedOffset
      };
      try {
        const results = await DBObject.findDirect(query, params);
        return results;
      } catch (error) {
        log("getAllJobTitles", error);
        ThrowError("Failed to fetch job titles");
      }
    }
  },
  Mutation: {
    async createJobTitle(_, { company_id, name, description }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("NO ACCESS.")
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company. Please enter a valid company number.");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      };

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
          name: context.name,
          company_id,
          task: "CREATE_JOB_TITLE",
          details: `Created job title: ${name}`
        })

        return await DBObject.findOne('hr_job_titles', { id: insertedId });
      } catch (error) {
        log("createJobTitle", error);
        ThrowError("Failed to insert JobTitle.");
      }
    },

    async updateJobTitle(_, { id, company_id, name, description }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("NO ACCESS.")
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid job title.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid name.");
      };
      const updatedData = {
        name,
        description
      };
      try {
        const updatedID = await DBObject.updateOne("hr_job_titles", updatedData, { id, company_id });
        if (!updatedID) {
          ThrowError("Failed to update job title.")
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id,
          task: "UPDATE_JOB_TITLE",
          details: `Updated job title id: ${id}, name: ${name}, description: ${description}`,
        })
        return await DBObject.findOne("hr_job_titles", { id, company_id });
      } catch (error) {
        log("updateJobTitle", error);
        ThrowError("Error updating job titles");
      }
    },

    async deleteJobTitle(_, { id, company_id }, context: Record<string, any>) {
      if (!context.id) {
        ThrowError("#RELOGIN")
      }

      if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
        ThrowError("NO ACCESS.")
      }

      if (!Validate.positiveInteger(id)) {
        ThrowError("Invalid job title.");
      }
      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company.");
      }
      try {
        const deletedID = await DBObject.deleteOne("hr_job_titles", { id, company_id });
        if (!deletedID) {
          ThrowError("Failed to delete job title.")
        }
        SaveAuditTrail({
          user_id: context.id,
          name: context.name,
          company_id: company_id,
          task: "DELETE_JOB_TITLE",
          details: `Deleted job title: ${id}`
        })
        return id;
      } catch (error) {
        log("deleteJobTitle", error);
        ThrowError("Error deleting job title");
      }
    }
  }
};