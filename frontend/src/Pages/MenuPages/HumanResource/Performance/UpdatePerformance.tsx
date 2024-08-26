import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UPDATE_PERFORMNCE_REVIEW } from "../../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../../Components/Forms";
import { PAGETITLE } from "../../../../Components/Typography";
import Session from "../../../../Helpers/Session";
import { APIResponse } from "../../../../Helpers/General";
import { Validate } from "../../../../Helpers/Validate";
const UpdatePerformance = () => {

    const [formData, setFormData] = useState({
        company_id:"",
        employee_id:"",
        reviewer_id:"",
        review_date:"",
        rating:"",
        comments:""
      });

      const [updatePerformance] = useMutation(UPDATE_PERFORMNCE_REVIEW, {
        onCompleted: () => {
          Session.saveAlert("Performance Review updated successfully.", "success");
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

      const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handlePerformanceReview = (event:React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (!Validate.integer(formData.company_id)) {
          Session.saveAlert("Invalid Company ID.", "error");
        };
        if (!Validate.integer(formData.employee_id)) {
          Session.saveAlert("Invalid employee_id.", "error");
        };
        if (!Validate.integer(formData.reviewer_id)) {
          Session.saveAlert("Invalid reviewer_id.", "error");
        };
        if (!Validate.string(formData.review_date)) {
            Session.saveAlert("Invalid review_date.", "error");
         };
          if (!Validate.string(formData.rating)) {
            Session.saveAlert("Invalid rating.", "error");
        };
          if (!Validate.string(formData.comments)) {
            Session.saveAlert("Invalid comments.", "error");
          };
        if (Session.countAlert() > 0) {
          Session.showAlert({});
          return;
        }
        updatePerformance({ variables: { ...formData } });
      };

  return (
    <div className="container">
    <PAGETITLE>UPDATE DEPARTMENT</PAGETITLE>
    <form>
      <label>Company ID</label>
      <INPUT
        type="text"
        id="company_id"
        name="company_id"
        value={parseInt(formData.company_id)}
        onChange={handleChange}
        placeholder="Enter company ID"
      />

<label>Employee ID</label>
      <INPUT
        type="text"
        id="employee_id"
        name="employee_id"
        value={parseInt(formData.employee_id)}
        onChange={handleChange}
        placeholder="Enter Employee ID"
      />
        <label>Reviewer ID</label>
        <INPUT
          type="text"
          id="reviewer_id"
          name="reviewer_id"
          value={parseInt(formData.reviewer_id)}
          onChange={handleChange}
          placeholder="Enter department name"
        />
        <label>Description</label>
        <INPUT
          type="text"
          id="review_date"
          name="review_date"
          value={formData.review_date}
          onChange={handleChange}
          placeholder="Enter review_date"
        />
        <BLOCKBUTTON type="submit" onClick={{handlePerformanceReview}}>Update Department</BLOCKBUTTON>
    </form>
    <ToastContainer />
  </div>
  )
}

export default UpdatePerformance