import { SaveAuditTrail, ThrowError } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { DateTime } from "luxon";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import _CONFIG from "../../config/config.js";

export default {
    Query: {
        async getEmployeePerformanceReviews(_, { company_id, employee_id, offset }, context: Record<string, any>) {
            if(!context.id){
                ThrowError("#RELOGIN")
            };
            if(!Validate.integer(company_id)){
                ThrowError("Invalid company.")
            };
            if(!Validate.integer(employee_id)){
                ThrowError("Invalid employee id.")
            };
            if (!hasPermission({ context, company_id, tasks: ["GET_EMPLOYEE_PERFORMANCE_REVIEWS"] })) {
                ThrowError("NO ACCESS.")
              }
            const pageSize = _CONFIG.settings.PAGINATION_LIMIT || 30;
            const calculatedOffset = offset * pageSize;
            const query = `
              SELECT id, company_id, employee_id, reviewer_id, review_date, rating, comments,
                     created_at, updated_at
              FROM hr_performance_reviews
              WHERE company_id = :company_id
                AND employee_id = :employee_id
              ORDER BY review_date DESC, id DESC
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
                    task: "GET_EMPLOYEE_PERFORMANCE_REVIEWS",
                    details: `Retrieved performance reviews for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch((error)=>{
                    ThrowError(error);
                });
                return results.map(review => ({
                    ...review,
                    review_date: review.review_date.toSQL(),
                    rating: parseInt(review.rating, 10)
                }));
            } catch (error) {
                ThrowError("Failed to fetch employee performance reviews");
            }
        }
    },
    Mutation: {
        async createPerformanceReview(_, { company_id, employee_id, reviewer_id, review_date, rating, comments }, context: Record<string, any>) {

            if (!context.id) {
                ThrowError("#RELOGIN")
            }
            if (!Validate.integer(company_id)) {
                ThrowError("Invalid company.");
            };

            if (!Validate.integer(employee_id)) {
                ThrowError("Invalid employee ID.");
            };
            if(!Validate.integer(reviewer_id)){
                ThrowError("INvalid reviewer ID.")
            };
            if(!Validate.date(review_date)){
                ThrowError("Invalid Date.")
            };
            if (!Validate.integer(rating)) {
                ThrowError("Invalid rating.");
            };
            if (!Validate.string(comments)) {
                ThrowError("Invalid comment.");
            };
            if (!hasPermission({ context, company_id, tasks: ["CREATE_PERFORMANCE_REVIEW"] })) {
                ThrowError("NO ACCESS.")
              }
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
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "CREATE_PERFORMANCE_REVIEW",
                    details: `Created performance review for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch((error)=>{
                    ThrowError(error);
                })
                return insertedID;
            } catch (error) {
                ThrowError("Error inserting performance review");
            }
        },
        async updatePerformanceReview(_, { id, company_id, employee_id, reviewer_id, review_date, rating, comments }, context: Record<string, any>) {

            if (!context.id) {
                ThrowError("#RELOGIN")
            };
            if(!Validate.integer(id)){
                ThrowError("Invalid ID.")
            };
            if (!Validate.integer(company_id)) {
                ThrowError("Invalid company.");
            };

            if (!Validate.integer(employee_id)) {
                ThrowError("Invalid employee ID.");
            };
            if(!Validate.integer(reviewer_id)){
                ThrowError("Invalid reviewer ID.")
            };
            if(!Validate.date(review_date)){
                ThrowError("Invalid Date.")
            };
            if (!Validate.integer(rating)) {
                ThrowError("Invalid rating.");
            };
            if (!Validate.string(comments)) {
                ThrowError("Invalid comment.");
            };
            if (!hasPermission({ context, company_id, tasks: ["UPDATE_PERFORMANCE_REVIEW"] })) {
                ThrowError("NO ACCESS.")
              }
            const updateData = {
                company_id,
                employee_id,
                review_date,
                reviewer_id,
                rating,
                comments
            };
            try {
                const updatedID = await DBObject.updateOne("hr_performance_reviews", updateData, { id });
                 SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "UPDATE_PERFORMANCE_REVIEW",
                    details: `Updated performance review ${id} for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch((error)=>{
                    ThrowError(error);
                });
                return updatedID;
            } catch (error) {
                ThrowError("Error updating performance review");
            }
        },

        async deletePerformanceReview(_, { id }, context: Record<string, any>) {
            if(!Validate.integer(id)){
                ThrowError("Invalid ID.")
            };
            try {
                const reviewToDelete = await DBObject.findOne("hr_performance_reviews", { id });
                if (!reviewToDelete){
                    ThrowError("Review not found");
                };
                if (!hasPermission({ context, company_id: reviewToDelete.company_id, tasks: ["DELETE_PERFORMANCE_REVIEW"] })) {
                    ThrowError("NO ACCESS.")
                  }
                const deleteID = await DBObject.deleteOne("hr_performance_reviews", { id });
                 SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id: context.company_id,
                    task: "DELETE_PERFORMANCE_REVIEW",
                    details: `Deleted performance review ${id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                }).catch((error)=>{
                    ThrowError(error)
                })
                return deleteID;
            } catch (error) {
                ThrowError("Error deleting performance review");
            }
        }
    }
}