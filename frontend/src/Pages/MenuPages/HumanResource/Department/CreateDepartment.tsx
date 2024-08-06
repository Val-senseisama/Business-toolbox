import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CREATE_DEPARTMENT } from "../../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../../Components/Forms"; 
import { PAGETITLE } from "../../../../Components/Typography";
import Session from "../../../../Helpers/Session";
import { APIResponse } from "../../../../Helpers/General";
import { Validate } from "../../../../Helpers/Validate";

const CreateDepartment:React.FC = () => {
    const [formData, setFormData] = useState({
      company_id: "",
      name: "",
      description: "",
    });
  
    const [department] = useMutation(CREATE_DEPARTMENT, {
      onCompleted: () => {
        Session.saveAlert("Department created successfully.", "success");
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
    const createDepartment = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if(!Validate.integer(formData.company_id)) {
          Session.saveAlert(' Invalid Company ID.', 'error');
      };
      if(!Validate.string(formData.name)) {
          Session.saveAlert(' Invalid name.', 'error');
      };
      if(!Validate.string(formData.description)) {
          Session.saveAlert(' Invalid description.', 'error');
      };
  
      if (Session.countAlert() > 0) {
          Session.showAlert({});
          return;
      }
       department({variables:{...formData}})
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      // Session.remove("alerts");
    };
  
    return (
      <div className="container">
        <PAGETITLE>Create A Department</PAGETITLE>
        <form onSubmit={createDepartment}> 
          <label>Company ID</label>
          <INPUT
            type="text"
            id="company_id"
            name="company_id"
            value={formData.company_id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, company_id: e.target.value })
            }
            placeholder="Enter company_id"
          />
        <div>
          <label>Department Name</label>
          <INPUT
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Enter company Name."
          />
        </div>
        <div>
      <label>Description</label>
      <TEXTAREA
            // type="text"
            name="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter  Description."
          />
        </div>
        <div>
          <BLOCKBUTTON type="submit">Create Department</BLOCKBUTTON>
        </div>
        </form>
        <ToastContainer/>
      </div>
    );
  };
  
  export default CreateDepartment;