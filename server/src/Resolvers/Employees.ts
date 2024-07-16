import { ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";

export default {
    Query:{
        async getAllEmployees(_,{company_id, offset}) {
            const query = `
              SELECT id, company_id, branch_id, details, type, category, balance, 
                     created_at, updated_at
              FROM accounts
              WHERE company_id = :company_id
                AND type = 'EMPLOYEE'  
              ORDER BY id
              LIMIT 10 OFFSET :offset
            `;
          
            const params = {
              company_id: company_id,
              offset: offset
            };
          
            try {
              const results = await DBObject.findDirect(query, params);
              return results.map(account => ({
                ...account,
                details: JSON.parse(account.details),  
                created_at: account.created_at.toISOString(), 
                updated_at: account.updated_at.toISOString()
              }));
            } catch (error) {
              console.error("Error fetching employees:", error);
              throw error;
            }
          }
    },
    Mutation:{
      async createEmployee({_,company_id, branch_id, details}){
        const insertEmployee = {
          company_id: company_id,
          branch_id: branch_id,
          details: details
        };
        try {
          const inserteID = await DBObject.insertOne("accountd", insertEmployee);
          return inserteID
        } catch (error) {
          ThrowError("Couldn't insert employee ")
        }
      },

      async  updateEmployee(_,{id, company_id, branch_id, details}){
        const updatedData = {
          company_id,
          branch_id,
          details
        }
        try {
          const updatedID = await DBObject.updateOne("accounts", updatedData, {id: id, company_id});
          return updatedID
        } catch (error) {
          ThrowError("Error updating EMployee")
        }
      },
      
      async deleteEmployee(_,{id}){
        try {
          const deletedID = await DBObject.deleteOne("accounts", {id: id});
          return deletedID;
        } catch (error) {
          ThrowError("Error deleting Employee")
        }
      }
    }
}