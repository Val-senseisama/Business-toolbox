import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PERFORMANCE_REVIEW} from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse } from '../../../../Helpers/General';
import { Validate } from '../../../../Helpers/Validate';

const CreatePerformance = () => {
    const [formData, setFormData] = useState({
        company_id:"",
        employee_id:"",
        reviewer_id:"",
        review_date:"",
        rating:"",
        comments:""
      });

    const [jobTitle] = useMutation(CREATE_PERFORMANCE_REVIEW, {
        onCompleted: () => {
          Session.saveAlert("Performance Review created successfully.", "success");
          Session.showAlert({});
        },
        onError: (error) => {
          APIResponse(error);
          if (Session.countAlert() < 1) {
            Session.saveAlert("An error occurred. Please try again.", "error");
          }
          Session.showAlert({});
          Session.removeAll();
        },
      });

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        // Session.remove("alerts");
      };


      const doPerformanceReview = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!Validate.string(formData.company_id)) {
            Session.saveAlert(' Invalid company_id.', 'error');
        };
        if(!Validate.string(formData.employee_id)) {
            Session.saveAlert(' Invalid employee_id.', 'error');
        };
        if(!Validate.string(formData.reviewer_id)) {
            Session.saveAlert(' Invalid reviewer_id.', 'error');
        };
        if(!Validate.string(formData.review_date)) {
            Session.saveAlert(' Invalid employee_id.', 'error');
        };
        if(!Validate.string(formData.rating)) {
            Session.saveAlert(' Invalid rating.', 'error');
        };
        if(!Validate.string(formData.comments)) {
            Session.saveAlert(' Invalid comments.', 'error');
        };
        if (Session.countAlert() > 0) {
            Session.showAlert({});
            return;
        }
        jobTitle({variables:{...formData}})
      };

  return (
    <div className="container">
    <PAGETITLE>Create A Department</PAGETITLE>
    <form onSubmit={doPerformanceReview}> 
      <label>Company_id  </label>
      <INPUT
        type="text"
        id="company_id"
        name="company_id"
        value={formData.company_id}
        onChange={handleChange}
        placeholder="Enter company ID."
      />
 
  <label> Employee_id  </label>
  <INPUT
        type="text"
        id="employee_id"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        placeholder="Enter employee_id."
      />
    <label> Reviewer_id </label>
  <INPUT
        type="text"
        id="reviewer_id"
        name="reviewer_id"
        value={formData.reviewer_id}
        onChange={handleChange}
        placeholder="Enter reviewer_id."
      />
   
   <label> Review date  </label>
  <INPUT
        type="text"
        id="review_date"
        name="review_date"
        value={formData.review_date}
        onChange={handleChange}
        placeholder="Enter review_date."
      />

   <label> Rating  </label>
  <INPUT
        type="text"
        id="rating"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        placeholder="Enter rating."
      />
   
   <label> comments  </label>
  <INPUT
        type="text"
        id="comments"
        name="comments"
        value={formData.comments}
        onChange={handleChange}
        placeholder="Enter comments."
      />
    <div>
      <BLOCKBUTTON type="submit">Create Job Title</BLOCKBUTTON>
    </div>
    </form>
    <ToastContainer/>
  </div>
  )
}

export default CreatePerformance