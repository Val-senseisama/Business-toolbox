import { ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";

export default {
    Query:{

        async getEmployeePerformanceReviews(company_id, employee_id, offset) {
            const query = `
              SELECT id, company_id, employee_id, reviewer_id, review_date, rating, comments,
                     created_at, updated_at
              FROM hr_performance_reviews
              WHERE company_id = :company_id
                AND employee_id = :employee_id
              ORDER BY review_date DESC, id DESC
              LIMIT 10 OFFSET :offset
            `;
          
            const params = {
              company_id: company_id,
              employee_id: employee_id,
              offset: offset
            };
          
            try {
              const results = await DBObject.findDirect(query, params);
              return results.map(review => ({
                ...review,
                review_date: review.review_date.toISOString().split('T')[0],  
                rating: parseInt(review.rating, 10),  
                created_at: review.created_at.toISOString(),
                updated_at: review.updated_at.toISOString()
              }));
            } catch (error) {
              console.error("Error fetching employee performance reviews:", error);
              throw error;
            }
          }
    }, 
    Mutation:{
        async  createPerformanceReview(_,{company_id, employee_id, reviewer_id, review_date, rating, comments}){
            const insertedData = {
                company_id: company_id,
                employee_id: employee_id,
                reviewer_id: reviewer_id,
                review_date: review_date,
                rating: rating,
                comments: comments
            };
            try {
                const insertedID = await DBObject.insertOne("hr_performance_reviews", insertedData);
                return insertedID;
            } catch (error) {
                ThrowError("Error inserting performance review")
            }
        },
        async  updatePerformanceReview(_,{id, company_id, employee_id, reviewer_id, review_date, rating, comments}){
            const updateData = {
                company_id: company_id,
                employee_id: employee_id,
                review_date: review_date,
                reviewer_id: reviewer_id,
                rating: rating,
                comments: comments
            };

            try {
                const updatedID = await DBObject.updateOne("hr_performance_reviews", updateData, {id});
                return updatedID;
            } catch (error) {
                ThrowError("Error updating performance review");
            }
        },

        async  deletePerformanceReview(_,{id}) {
            try {
                const deleteID = await DBObject.deleteOne("hr_performance_reviews", {id});
                return deleteID;
            } catch (error) {
                ThrowError("Error deleting performance review")
            }
        }
    }
}
