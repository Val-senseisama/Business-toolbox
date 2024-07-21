import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import CONFIG from "../../config/config.js";

export default {
    Query: {
        async getEmployeeQualifications(_, { company_id, employee_id, offset }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN")
            };

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("#NOACCESS")
            }

            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company.")
            };
            if (!Validate.positiveInteger(employee_id)) {
                ThrowError("Invalid employee.")
            };

            const pageSize = CONFIG.settings.PAGINATION_LIMIT || 30;
            const calculatedOffset = offset * pageSize;
            const query = `SELECT * FROM hr_qualifications
              WHERE company_id = :company_id AND employee_id = :employee_id LIMIT :limit OFFSET :offset`;

            const params = {
                company_id,
                employee_id,
                limit: pageSize,
                offset: calculatedOffset
            };

            try {
                const results = await DBObject.findDirect(query, params);
                return results;
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

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("#NOACCESS")
            }

            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company ID.")
            };
            if (!Validate.positiveInteger(employee_id)) {
                ThrowError("Invalid employee ID.")
            };

            if (!Validate.date(date_obtained)) {
                ThrowError("Invalid Date.")
            };


            if (!['EXPERIENCE', 'EDUCATION', 'CERTIFICATION', 'OTHERS'].includes(type)) {
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
                    name: context.name,
                    branch_id: 0,
                    company_id: company_id,
                    task: "CREATE_QUALIFICATION",
                    details: `Created ${type} qualification for employee ${employee_id}`
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

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("#NOACCESS")
            }

            if (!Validate.positiveInteger(id)) {
                ThrowError("Invalid ID.")
            }
            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company ID.")
            };

            if (!Validate.positiveInteger(employee_id)) {
                ThrowError("Invalid employee ID.")
            };
            if (!Validate.date(date_obtained)) {
                ThrowError("Invalid date.")
            };

            if (!['EXPERIENCE', 'EDUCATION', 'CERTIFICATION', 'OTHERS'].includes(type)) {
                ThrowError('Invalid qualification type');
            }

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
                    name: context.name,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "UPDATE_QUALIFICATION",
                    details: `Updated qualification ${id} for employee ${employee_id} to ${JSON.stringify(updatedData)}`,
                })
                return updatedID;
            } catch (error) {
                ThrowError("Error updating hr_qualifications");
            }
        },
        async deleteQualification(_, { id, company_id }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN")
            };

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("#NOACCESS")
            }

            if (!Validate.positiveInteger(id)) {
                ThrowError("Invalid Qualification.")
            }

            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company.")
            }

            try {
                const qualificationToDelete = await DBObject.findOne("hr_qualifications", { id, company_id });
                const deletedID = await DBObject.deleteOne("hr_qualifications", { id, company_id });
                SaveAuditTrail({
                    user_id: context.id,
                    name: context.name,
                    branch_id: 0,
                    company_id: company_id,
                    task: "DELETE_QUALIFICATION",
                    details: `Deleted qualification ${id} for employee ${qualificationToDelete.employee_id}`
                })
                return deletedID;
            } catch (error) {
                ThrowError("Error deleting HR qualification");
            }
        }
    }
}