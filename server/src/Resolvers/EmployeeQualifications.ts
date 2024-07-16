import { ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";
import { DateTime } from "luxon";
export default {
    Query:{
        async getEmployeeQualifications(company_id, employee_id, offset) {
            const query = `
              SELECT id, company_id, employee_id, type, description, date_obtained, 
                     created_at, updated_at
              FROM hr_qualifications
              WHERE company_id = :company_id
                AND employee_id = :employee_id
              ORDER BY date_obtained DESC, id DESC
              LIMIT 10 OFFSET :offset
            `;
          
            const params = {
              company_id: company_id,
              employee_id: employee_id,
              offset: offset
            };
          
            try {
              const results = await DBObject.findDirect(query, params);
              return results.map(qualification => ({
                ...qualification,
                type: qualification.type.toUpperCase(),  
                date_obtained: qualification.date_obtained.toISOString().split('T')[0], 
                created_at: qualification.created_at.toISOString(), 
                updated_at: qualification.updated_at.toISOString()
              }));
            } catch (error) {
              console.error("Error fetching employee qualifications:", error);
              throw error;
            }
          }
    },
    Mutation:{
        async createQualification(_,{company_id, employee_id, type, date_obtained, description}){
            if(!company_id){
                ThrowError("Invalid company")
            }
            if(!employee_id){
                ThrowError("Invalid employee ID")
            }
            const qualification = {
                company_id,
                employee_id,
                type,
                date_obtained,
                description,
                created_at:  DateTime.now().toUTC().toISO(),
                updated_at: DateTime.now().toUTC().toISO()
            };

            const validTypes = ['EXPERIENCE', 'EDUCATION', 'CERTIFICATION', 'OTHERS'];
            if (!validTypes.includes(type)) {
              ThrowError('Invalid qualification type');
            }
            
            try {
                const insertedId = await DBObject.insertOne("hr_qualifications", qualification);
                return insertedId;
            } catch (error) {
                ThrowError("Error inserting HR Qualifications")
            }
        },

        async  updateQualification(_,{id, company_id, employee_id, type, date_obtained, description}){
            if(!company_id){
                ThrowError("Invalid company")
            }
            if(!employee_id){
                ThrowError("Invalid employee ID")
            }
            
            const updatedData = {
                company_id: company_id,
                employee_id: employee_id,
                type,
                date_obtained,
                description
            };

            try {
                const updatedID = await DBObject.updateOne("hr_qualifications", updatedData, {id:id});
                return updatedID;
            } catch (error) {
                ThrowError("Error updating hr_qualifications")
            }
        },
        async deleteQualification(_,{id}){
            try {
                const deletedID = await DBObject.deleteOne("hr_qualifications", {id})
                return deletedID;
            } catch (error) {
                ThrowError("Error deleting HR qualification")
            }
        }

    }
}