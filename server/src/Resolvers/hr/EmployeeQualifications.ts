import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
    Query: {
        async getEmployeeQualifications(_, { company_id, employee_id, offset }, context) {
            const query = `
              SELECT id, company_id, employee_id, type, description, date_obtained, 
                     created_at, updated_at
              FROM hr_qualifications
              WHERE company_id = :company_id
                AND employee_id = :employee_id
              ORDER BY date_obtained DESC, id DESC
              LIMIT 10 OFFSET :offset
            `;

            const params = { company_id, employee_id, offset };

            try {
                const results = await DBObject.findDirect(query, params);

                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "GET_EMPLOYEE_QUALIFICATIONS",
                    details: `Retrieved qualifications for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                });


                return results.map(qualification => ({
                    ...qualification,
                    type: qualification.type.toUpperCase(),
                    date_obtained: qualification.date_obtained.toISOString().split('T')[0],
                    created_at: qualification.created_at.toISOString(),
                    updated_at: qualification.updated_at.toISOString()
                }));
            } catch (error) {
                console.error("Error fetching employee qualifications:", error);
                ThrowError("Failed to fetch employee qualifications");
            }
        }
    },
    Mutation: {
        async createQualification(_, { company_id, employee_id, type, date_obtained, description }, context) {
            if (!company_id) {
                ThrowError("Invalid company")
            };
            if (!employee_id) {
                ThrowError("Invalid employee ID")
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
                description,
                created_at: DateTime.now().toUTC().toISO(),
                updated_at: DateTime.now().toUTC().toISO()
            };

            try {
                const insertedId = await DBObject.insertOne("hr_qualifications", qualification);

                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "CREATE_QUALIFICATION",
                    details: `Created ${type} qualification for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                });

                return insertedId;
            } catch (error) {
                console.error("Error inserting HR Qualifications:", error);
                ThrowError("Error inserting HR Qualifications");
            }
        },
        async updateQualification(_, { id, company_id, employee_id, type, date_obtained, description }, context) {
            if (!company_id) {
                ThrowError("Invalid company")
            };
            if (!employee_id) {
                ThrowError("Invalid employee ID")
            };

            const updatedData = {
                company_id,
                employee_id,
                type,
                date_obtained,
                description,
                updated_at: DateTime.now().toUTC().toISO()
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
                });

                return updatedID;
            } catch (error) {
                console.error("Error updating hr_qualifications:", error);
                ThrowError("Error updating hr_qualifications");
            }
        },
        async deleteQualification(_, { id }, context) {
            try {
                const qualificationToDelete = await DBObject.findOne("hr_qualifications", { id });
                if (!qualificationToDelete) {
                    ThrowError("Qualification not found")
                };

                const deletedID = await DBObject.deleteOne("hr_qualifications", { id });

                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: qualificationToDelete.company_id,
                    task: "DELETE_QUALIFICATION",
                    details: `Deleted qualification ${id} for employee ${qualificationToDelete.employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                });

                return deletedID;
            } catch (error) {
                console.error("Error deleting HR qualification:", error);
                ThrowError("Error deleting HR qualification");
            }
        }
    }
}