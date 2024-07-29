import { log, SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";

export default {
    Query: {
        async getEmployeePerformanceReviews(_, { company_id, employee_id, offset }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN")
            };

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("NO ACCESS.")
            }

            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company.")
            };
            if (!Validate.positiveInteger(employee_id)) {
                ThrowError("Invalid employee.")
            };
            if(!Validate.positiveInteger(offset)){
                ThrowError("Invalid offset.")
            }
            const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
            const calculatedOffset = offset * pageSize;
            const query = ` SELECT * FROM hr_performance_reviews
              WHERE company_id = :company_id AND employee_id = :employee_id LIMIT ${_CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset} `;
            const params = {
                company_id: company_id,
                employee_id: employee_id,
                limit: pageSize,
                offset: calculatedOffset
            };
            try {
                const results = await DBObject.findDirect(query, params);
                return results;
            } catch (error) {
                log("getEmployeePerformanceReviews", error);
                ThrowError("Failed to fetch employee performance reviews");
            }
        }
    },
    Mutation: {
        async createPerformanceReview(_, { company_id, employee_id, reviewer_id, review_date, rating, comments }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN")
            };

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("NO ACCESS.")
            }

            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company.")
            };
            if (!Validate.positiveInteger(employee_id)) {
                ThrowError("Invalid employee.")
            };
            if (!Validate.positiveInteger(reviewer_id)) {
                ThrowError("Invalid reviewer.")
            };
            if (!Validate.date(review_date)) {
                ThrowError("Invalid Date.")
            };
            if (!Validate.positiveInteger(rating)) {
                ThrowError("Invalid rating.");
            };
            if (!Validate.string(comments)) {
                ThrowError("Invalid comment.");
            };

            const insertedData = {
                company_id,
                employee_id,
                reviewer_id,
                review_date,
                rating,
                comments
            };
            try {
                const insertedID = await DBObject.insertOne("hr_performance_reviews", insertedData);
                if (!insertedID) {
                    ThrowError("Error creating performance review");
                }
                SaveAuditTrail({
                    user_id: context.id,
                    name: context.name,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "CREATE_PERFORMANCE_REVIEW",
                    details: `Created performance review for employee ${employee_id}: ${JSON.stringify(insertedData)}`,
                })
                return await DBObject.findOne("hr_performance_reviews", { id: insertedID }, { columns: "id, company_id, employee_id, reviewer_id, review_date, rating, comments, created_at, updated_at" });
            } catch (error) {
                log("createPerformanceReview", error);
                ThrowError("Error inserting performance review");
            }
        },
        async updatePerformanceReview(_, { id, company_id, reviewer_id, review_date, rating, comments }, context: Record<string, any>) {

            if (!context.id) {
                ThrowError("#RELOGIN")
            };

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("NO ACCESS.")
            }
            if (!Validate.positiveInteger(id)) {
                ThrowError("Invalid Review.")
            };

            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company.")
            };

            if (!Validate.positiveInteger(reviewer_id)) {
                ThrowError("Invalid reviewer.")
            };
            if (!Validate.date(review_date)) {
                ThrowError("Invalid Date.")
            };
            if (!Validate.positiveInteger(rating)) {
                ThrowError("Invalid rating.");
            };
            if (!Validate.string(comments)) {
                ThrowError("Invalid comment.");
            };

            const updateData = {
                review_date,
                reviewer_id,
                rating,
                comments
            };
            try {
                const updatedID = await DBObject.updateOne("hr_performance_reviews", updateData, { id, company_id });
                if (!updatedID) {
                    ThrowError("Error updating performance review");
                }
                if(!Validate.positiveInteger(updatedID)) {
                    ThrowError("Error updating performance review");
                }
                SaveAuditTrail({
                    user_id: context.id,
                    name: context.name,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "UPDATE_PERFORMANCE_REVIEW",
                    details: `Updated performance review ${id}: ${JSON.stringify(updateData)}`,
                })

                return await DBObject.findOne("hr_performance_reviews", { id: updatedID }, { columns: "id, company_id, employee_id, reviewer_id, review_date, rating, comments, created_at, updated_at" });
            } catch (error) {
                log("updatePerformanceReview", error);
                ThrowError("Error updating performance review");
            }
        },

        async deletePerformanceReview(_, { id, company_id }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN")
            };

            if (!hasPermission({ context, company_id, tasks: ["manage_hr"] })) {
                ThrowError("NO ACCESS.")
            }
            if (!Validate.positiveInteger(id)) {
                ThrowError("Invalid Review.")
            };

            if (!Validate.positiveInteger(company_id)) {
                ThrowError("Invalid company.")
            };
            try {
                const deleteID = await DBObject.deleteOne("hr_performance_reviews", { id, company_id });
                if (!Validate.positiveInteger(deleteID)) {
                    ThrowError("Error deleting performance review");
                }
                SaveAuditTrail({
                    user_id: context.id,
                    name: context.name,
                    company_id: context.company_id,
                    task: "DELETE_PERFORMANCE_REVIEW",
                    details: `Deleted performance review ${id}`
                })
                return deleteID;
            } catch (error) {
                log("deletePerformanceReview", error);
                ThrowError("Error deleting performance review");
            }
        }
    }
}