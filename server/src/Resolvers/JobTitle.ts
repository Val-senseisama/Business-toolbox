import { ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";
import {DateTime} from "luxon"

export default {
  Query: {
    async getAllJobTitles(_,{company_id, offset}) {
      const query = `
              SELECT id, name, description, created_at, updated_at
              FROM hr_job_titles
              WHERE company_id = :company_id
              ORDER BY id
              LIMIT 10 OFFSET :offset
            `;

      const params = {
        company_id: company_id,
        offset: offset
      };

      try {
        const results = await DBObject.findDirect(query, params);
        return results;
      } catch (error) {
        console.error("Error fetching job titles:", error);
        throw error;
      }
    }
  },
  Mutation: {
    async createJobTitle(_, { company_id, name, description }) {
      if (!company_id) {
        ThrowError("Invalid company")
      }
      if (!name) {
        ThrowError("Invalid name")
      }

      const data = {
        company_id,
        name,
        description,
        created_at:  DateTime.now().toUTC().toISO(),
        updated_at:  DateTime.now().toUTC().toISO(),
      }

      try {
        const insertedId = await DBObject.insertOne('hr_job_titles', data);
        if (!insertedId) {
          ThrowError('Failed to create JobTitle');
        }
        return insertedId
      } catch (error) {
        ThrowError(" Failed to insert JobTitle")
      }
    },
    async updateJobTitle({ _, id, company_id, name, description }) {
      if (!company_id) {
        ThrowError("Invalid company")
      }
      if (!name) {
        ThrowError("Invalid name")
      }

      const uodatedData = {
        company_id: company_id,
        name: name,
        description: description
      }

      try {
        const updatedID = await DBObject.updateOne("hr_job_titles", uodatedData, { id: id });
        return updatedID;
      } catch (error) {
        ThrowError("Error updating job titles")
      }
    },

    async deleteJobTitle(_, { id }) {
      if (!id) {
        ThrowError("Invalid ID")
      };

      try {
        const deletedID = await DBObject.deleteOne("hr_job_titles", { id: id });
        return deletedID;
      } catch (error) {
        ThrowError("Error deleting department")
      }
    }
  }
}
