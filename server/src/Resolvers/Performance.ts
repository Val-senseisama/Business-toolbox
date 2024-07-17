import { SaveAuditTrail, ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";
import { DateTime } from "luxon";

export default {
    Query: {
        async getEmployeePerformanceReviews(_, { company_id, employee_id, offset }, context) {
            const query = `
              SELECT id, company_id, employee_id, reviewer_id, review_date, rating, comments,
                     created_at, updated_at
              FROM hr_performance_reviews
              WHERE company_id = :company_id
                AND employee_id = :employee_id
              ORDER BY review_date DESC, id DESC
              LIMIT 10 OFFSET :offset
            `;
          
            const params = { company_id, employee_id, offset };
          
            try {
                const results = await DBObject.findDirect(query, params);
                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id:context.company_id,
                    task: "GET_EMPLOYEE_PERFORMANCE_REVIEWS",
                    details: `Retrieved performance reviews for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                  });
               
          
                return results.map(review => ({
                    ...review,
                    review_date: review.review_date.toISOString().split('T')[0],  
                    rating: parseInt(review.rating, 10),  
                    created_at: review.created_at.toUTC().toISO(),
                    updated_at: review.updated_at.toUTC().toISO()
                }));
            } catch (error) {
                console.error("Error fetching employee performance reviews:", error);
                ThrowError("Failed to fetch employee performance reviews");
            }
        }
    }, 
    Mutation: {
        async createPerformanceReview(_, { company_id, employee_id, reviewer_id, review_date, rating, comments }, context) {
            const insertedData = {
                company_id,
                employee_id,
                reviewer_id,
                review_date,
                rating,
                comments,
                created_at: DateTime.now().toUTC().toISO(),
                updated_at: DateTime.now().toUTC().toISO() 
            };
            try {
                const insertedID = await DBObject.insertOne("hr_performance_reviews", insertedData);
                
                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id:context.company_id,
                    task: "CREATE_PERFORMANCE_REVIEW",
                    details: `Created performance review for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                  });
             
                return insertedID;
            } catch (error) {
                ThrowError("Error inserting performance review");
            }
        },
        async updatePerformanceReview(_, { id, company_id, employee_id, reviewer_id, review_date, rating, comments }, context) {
            const updateData = {
                company_id,
                employee_id,
                review_date,
                reviewer_id,
                rating,
                comments,
                updated_at: DateTime.now().toUTC().toISO()
            };
            try {
                const updatedID = await DBObject.updateOne("hr_performance_reviews", updateData, { id });

                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id:context.company_id,
                    task: "UPDATE_PERFORMANCE_REVIEW",
                    details: `Updated performance review ${id} for employee ${employee_id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                  });

           
                return updatedID;
            } catch (error) {
                ThrowError("Error updating performance review");
            }
        },
        async deletePerformanceReview(_, { id }, context) {
            try {
                const reviewToDelete = await DBObject.findOne("hr_performance_reviews", { id });
                if (!reviewToDelete) ThrowError("Performance review not found");

                const deleteID = await DBObject.deleteOne("hr_performance_reviews", { id });

                await SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    branch_id: context.branch_id,
                    company_id:context.company_id,
                    task: "DELETE_PERFORMANCE_REVIEW",
                    details: `Deleted performance review ${id}`,
                    browser_agents: context.userAgent,
                    ip_address: context.ip
                  });

                return deleteID;
            } catch (error) {
                ThrowError("Error deleting performance review");
            }
        }
    }
}