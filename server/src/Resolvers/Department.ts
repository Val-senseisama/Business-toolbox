import { ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
  Query:{
    async getAllDepartments(_,{company_id, offset}) {
      const query = `
        SELECT id, name, description, created_at, updated_at
        FROM hr_departments
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
        ThrowError("Failed to find departments");
      }
    },
    
  },
  Mutation:{
    async createDepartment(_,{company_id, name, description}) {
      if(!company_id){
        ThrowError("Invalid company")
      }
      if(!name){
        ThrowError("Invalid name")
      }
      const data = {
        company_id: company_id,
        name: name,
        description: description,
        created_at:  DateTime.now().toUTC().toISO(),
        updated_at:  DateTime.now().toUTC().toISO(),
      };
      try {
        const insertId = await DBObject.insertOne('hr_departments', data);
        if (!insertId) {
          ThrowError('Failed to create department');
        }
        const newDepartment = await DBObject.findOne('hr_departments', { id: insertId });
        if (!newDepartment) {
          ThrowError('Failed to fetch created department');
        };
        return insertId;
      } catch (error) {
        ThrowError("Error creating department");
      }
    },

    async  updateDepartment(_, {id, company_id, name, description}) {
      if(!company_id){
        ThrowError("Invalid company")
      }
      if(!name){
        ThrowError("Invalid name")
      }

      if (!id) {
        ThrowError("Invalid department ID");
      }
      if (!company_id) {
        ThrowError("Invalid company");
      }
      const updatedData = {
        company_id,name, description
      }
      try {
        const existingDepartment = await DBObject.findOne('hr_departments', { id: id, company_id: company_id });
        if (!existingDepartment) {
          ThrowError("Department not found or does not belong to the specified company");
        }

        const updatedID = await DBObject.updateOne("hr_departments",updatedData, {id:id});
        return updatedID;
        
      } catch (error) {
        ThrowError("Error updating department information")
      }
    },

    async deleteDepartment(_, {id}) {
      if(!id){
        ThrowError("Invalid ID")
      };
      
      try {
        const deletedID = await DBObject.deleteOne("hr_departments", {id: id});
        return deletedID;
      } catch (error) {
        ThrowError("Error deleting department")
      }
    }
  }

}