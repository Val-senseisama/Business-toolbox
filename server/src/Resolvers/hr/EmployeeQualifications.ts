// import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
// import { DBObject } from "../../Helpers/MySQL.js";
// import { DateTime } from "luxon";
// import { Validate } from "../../Helpers/Validate.js";
// import hasPermission from "../../Helpers/hasPermission.js";
// import _CONFIG from "../../config/config.js";

// export default {
//     Query: {
//         async getEmployeeQualifications(_, { company_id, employee_id, offset }, context: Record<string, any>) {
//         if(!context.id){
//             ThrowError("#RELOGIN")
//         };
//         if(!Validate.integer(company_id)){
//             ThrowError("Invalid company_id.")
//         };
//         if(!Validate.integer(employee_id)){
//             ThrowError("Invalid employee_id.")
//         };
//         const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
//         const calculatedOffset = offset * pageSize;
//             const query = `
//               SELECT id, company_id, employee_id, type, description, date_obtained, 
//                      created_at, updated_at
//               FROM hr_qualifications
//               WHERE company_id = :company_id
//                 AND employee_id = :employee_id
//               ORDER BY date_obtained DESC, id DESC
//               LIMIT:limit OFFSET :offset
//             `;
//             const params = {
//                  company_id: company_id, 
//                  employee_id: employee_id, 
//                  limit: pageSize,
//                  offset: calculatedOffset                
//                 };
//             try {
//                 const results = await DBObject.findDirect(query, params);
//                  SaveAuditTrail({
//                     user_id: context.id,
//                     email: context.email,
//                     branch_id: context.branch_id,
//                     company_id: context.company_id,
//                     task: "GET_EMPLOYEE_QUALIFICATIONS",
//                     details: `Retrieved qualifications for employee ${employee_id}`,
//                     browser_agents: context.userAgent,
//                     ip_address: context.ip
//                 }).catch((error)=>{
//                     ThrowError(error.message);
//                 })
//                 return results.map(qualification => ({
//                     ...qualification,
//                     type: qualification.type.toUpperCase(),
//                     date_obtained:qualification.date_obtained.toSQL(),
               
//                 }));
//             } catch (error) {
//                 ThrowError("Failed to fetch employee qualifications");
//             }
//         }
//     },
//     Mutation: {
//         async createQualification(_, { company_id, employee_id, type, date_obtained, description }, context: Record<string, any>) {
           
//             if (!context.id) {
//                 ThrowError("#RELOGIN")
//               };
            
//               if (!Validate.integer(company_id)) {
//                 ThrowError("Invalid company ID.")
//               };
//               if (!Validate.integer(employee_id)) {
//                 ThrowError("Invalid employee ID.")
//               };
//               if (!Validate.date(date_obtained)) {
//                 ThrowError("Invalid Date.")
//               };
//               if (!Validate.string(description)) {
//                 ThrowError("Invalid description.")
//               };
//             //   if (!Validate.array(type)) {
//             //     ThrowError("Invalid type")
//             //   };

//             const validTypes = ['EXPERIENCE', 'EDUCATION', 'CERTIFICATION', 'OTHERS'];
//             if (!validTypes.includes(type)) {
//                 ThrowError('Invalid qualification type');
//             }
//             const qualification = {
//                 company_id,
//                 employee_id,
//                 type,
//                 date_obtained,
//                 description
//             };
//             try {
//                 const insertedId = await DBObject.insertOne("hr_qualifications", qualification);
//                  SaveAuditTrail({
//                     user_id: context.id,
//                     email: context.email,
//                     branch_id: context.branch_id,
//                     company_id: context.company_id,
//                     task: "CREATE_QUALIFICATION",
//                     details: `Created ${type} qualification for employee ${employee_id}`,
//                     browser_agents: context.userAgent,
//                     ip_address: context.ip
//                 }).catch((error)=>{
//                     ThrowError(error)
//                 })
//                 return insertedId;
//             } catch (error) {
//                 ThrowError("Error inserting HR Qualifications");
//             }
//         },
//         async updateQualification(_, { id, company_id, employee_id, type, date_obtained, description }, context: Record<string, any>) {
//             if (!context.id) {
//                 ThrowError("#RELOGIN")
//               };
//               if(!Validate.integer(id)){
//                 ThrowError("Invalid ID.")
//               }
//               if (!Validate.integer(company_id)) {
//                 ThrowError("Invalid company ID.")
//               };
//               if (!Validate.integer(employee_id)) {
//                 ThrowError("Invalid employee ID.")
//               };
//               if (!Validate.date(date_obtained)) {
//                 ThrowError("Invalid date.")
//               };
//               if (!Validate.string(description)) {
//                 ThrowError("Invalid description.")
//               };

//             const updatedData = {
//                 company_id,
//                 employee_id,
//                 type,
//                 date_obtained,
//                 description,
//             };
//             try {
//                 const updatedID = await DBObject.updateOne("hr_qualifications", updatedData, { id });
//                 await SaveAuditTrail({
//                     user_id: context.id,
//                     email: context.email,
//                     branch_id: context.branch_id,
//                     company_id: context.company_id,
//                     task: "UPDATE_QUALIFICATION",
//                     details: `Updated qualification ${id} for employee ${employee_id}`,
//                     browser_agents: context.userAgent,
//                     ip_address: context.ip
//                 }).catch((error)=>{
//                     ThrowError(error);
//                 });
//                 return updatedID;
//             } catch (error) {
//                 ThrowError("Error updating hr_qualifications");
//             }
//         },
//         async deleteQualification(_, { id }, context: Record<string, any>) {
//             if(!Validate.integer(id)){
//                 ThrowError("Invalid ID.")
//             }
//             try {
//                 const qualificationToDelete = await DBObject.findOne("hr_qualifications", { id });
//                 if (!qualificationToDelete) {
//                     ThrowError("Qualification not found")
//                 };

//                 const deletedID = await DBObject.deleteOne("hr_qualifications", { id });
//                  SaveAuditTrail({
//                     user_id: context.id,
//                     email: context.email,
//                     branch_id: context.branch_id,
//                     company_id: qualificationToDelete.company_id,
//                     task: "DELETE_QUALIFICATION",
//                     details: `Deleted qualification ${id} for employee ${qualificationToDelete.employee_id}`,
//                     browser_agents: context.userAgent,
//                     ip_address: context.ip
//                 }).catch(err => {
//                     ThrowError(err);
//                 });

//                 return deletedID;
//             } catch (error) {
//                 ThrowError("Error deleting HR qualification");
//             }
//         }
//     }
// }
import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";

export default {
    Query: {
        async getEmployeeQualifications(_, { company_id, employee_id, offset }, context: Record<string, any>) {
            if(!context.id){
                ThrowError("#RELOGIN")
            };
            if(!Validate.integer(company_id)){
                ThrowError("Invalid company_id.")
            };
            if(!Validate.integer(employee_id)){
                ThrowError("Invalid employee_id.")
            };
            
            if (!hasPermission({ context, company_id, tasks: ["GET_EMPLOYEE_QUALIFICATIONS"] })) {
                ThrowError("NO ACCESS.")
            }
            
            const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
            const calculatedOffset = offset * pageSize;
            const query = `
              SELECT id, company_id, employee_id, type, description, date_obtained, 
                     created_at, updated_at
              FROM hr_qualifications
              WHERE company_id = :company_id
                AND employee_id = :employee_id
              ORDER BY date_obtained DESC, id DESC
              LIMIT:limit OFFSET :offset
            `;
            const params = {
                 company_id: company_id, 
                 employee_id: employee_id, 
                 limit: pageSize,
                 offset: calculatedOffset                
                };
            try {
                const results = await DBObject.findDirect(query, params);
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "GET_EMPLOYEE_QUALIFICATIONS",
                    details: `Retrieved qualifications for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch((error)=>{
                    ThrowError(error.message);
                })
                return results.map(qualification => ({
                    ...qualification,
                    type: qualification.type.toUpperCase(),
                    date_obtained:qualification.date_obtained.toSQL(),
                }));
            } catch (error) {
                ThrowError("Failed to fetch employee qualifications");
            }
        }
    },
    Mutation: {
        async createQualification(_, { company_id, employee_id, type, date_obtained, description }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN")
            };
            if (!Validate.integer(company_id)) {
                ThrowError("Invalid company ID.")
            };
            if (!Validate.integer(employee_id)) {
                ThrowError("Invalid employee ID.")
            };
            
            if (!hasPermission({ context, company_id, tasks: ["CREATE_QUALIFICATION"] })) {
                ThrowError("NO ACCESS.")
            }
            
            if (!Validate.date(date_obtained)) {
                ThrowError("Invalid Date.")
            };
            if (!Validate.string(description)) {
                ThrowError("Invalid description.")
            };

            const validTypes = ['EXPERIENCE', 'EDUCATION', 'CERTIFICATION', 'OTHERS'];
            if (!validTypes.includes(type)) {
                ThrowError('Invalid qualification type');
            }
            const qualification = {
                company_id,
                employee_id,
                type,
                date_obtained,
                description
            };
            try {
                const insertedId = await DBObject.insertOne("hr_qualifications", qualification);
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "CREATE_QUALIFICATION",
                    details: `Created ${type} qualification for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch((error)=>{
                    ThrowError(error)
                })
                return insertedId;
            } catch (error) {
                ThrowError("Error inserting HR Qualifications");
            }
        },
        async updateQualification(_, { id, company_id, employee_id, type, date_obtained, description }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN")
            };
            if(!Validate.integer(id)){
                ThrowError("Invalid ID.")
            }
            if (!Validate.integer(company_id)) {
                ThrowError("Invalid company ID.")
            };
            
            if (!hasPermission({ context, company_id, tasks: ["UPDATE_QUALIFICATION"] })) {
                ThrowError("NO ACCESS.")
            }
            
            if (!Validate.integer(employee_id)) {
                ThrowError("Invalid employee ID.")
            };
            if (!Validate.date(date_obtained)) {
                ThrowError("Invalid date.")
            };
            if (!Validate.string(description)) {
                ThrowError("Invalid description.")
            };

            const updatedData = {
                company_id,
                employee_id,
                type,
                date_obtained,
                description,
            };
            try {
                const updatedID = await DBObject.updateOne("hr_qualifications", updatedData, { id });
                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "UPDATE_QUALIFICATION",
                    details: `Updated qualification ${id} for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch((error)=>{
                    ThrowError(error);
                });
                return updatedID;
            } catch (error) {
                ThrowError("Error updating hr_qualifications");
            }
        },
        async deleteQualification(_, { id }, context: Record<string, any>) {
            if(!Validate.integer(id)){
                ThrowError("Invalid ID.")
            }
            try {
                const qualificationToDelete = await DBObject.findOne("hr_qualifications", { id });
                if (!qualificationToDelete) {
                    ThrowError("Qualification not found")
                };
                
                if (!hasPermission({ context, company_id: qualificationToDelete.company_id, tasks: ["DELETE_QUALIFICATION"] })) {
                    ThrowError("NO ACCESS.")
                }

                const deletedID = await DBObject.deleteOne("hr_qualifications", { id });
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: qualificationToDelete.company_id,
                    task: "DELETE_QUALIFICATION",
                    details: `Deleted qualification ${id} for employee ${qualificationToDelete.employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch(err => {
                    ThrowError(err);
                });

                return deletedID;
            } catch (error) {
                ThrowError("Error deleting HR qualification");
            }
        }
    }
}