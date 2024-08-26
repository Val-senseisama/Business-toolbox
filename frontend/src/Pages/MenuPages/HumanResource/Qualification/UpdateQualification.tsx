import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {UPDATE_QUALIFICATION } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT,SELECT} from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse } from '../../../../Helpers/General';
import { Validate } from '../../../../Helpers/Validate';

const UpdateQualification = () => {
    const [updateQualification] = useMutation(UPDATE_QUALIFICATION,{
        onCompleted: () => {
            Session.saveAlert("Qualification Updated successfully.", "success");
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

    const [formData, setFormData] = useState({
        company_id: "",
        employee_id:"",
        name: "",
        description: "",
        type:"",
        date_obtained:""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };

      const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!Validate.integer(formData.company_id)) {
            Session.saveAlert(' Invalid Company ID.', 'error');
        };
        if(!Validate.integer(formData.employee_id)) {
            Session.saveAlert(' Invalid Employee ID.', 'error');
        };
        if(!Validate.string(formData.name)) {
            Session.saveAlert(' Invalid name.', 'error');
        };
        if(!Validate.string(formData.description)) {
            Session.saveAlert(' Invalid description.', 'error');
        };
        if(!Validate.string(formData.type)) {
            Session.saveAlert(' Invalid type.', 'error');
        };
        if(!Validate.string(formData.date_obtained)) {
            Session.saveAlert(' Invalid Date Obtained.', 'error');
        }
        if (!['EXPERIENCE', 'EDUCATION', 'CERTIFICATION', 'OTHERS'].includes(formData.type)) {
            Session.saveAlert(' Invalid Qualification type.', 'error');
        }

        if (Session.countAlert() > 0) {
            Session.showAlert({});
            return;
        }
        updateQualification({variables:{...formData}})
      };
  return (
    <div> 
    <PAGETITLE>CREATE HR QUALIFICATION</PAGETITLE>

   
    <form onSubmit={handleCreate}>
   
      <label>Company ID</label>
      <INPUT
        type="text"
        name="companyId"
        value={formData.company_id}
        onChange={handleChange}
        placeholder="Enter company ID"
      />
    

      <label>Branch ID</label>
      <INPUT
        type="text"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        placeholder="Enter Employee ID"
      />

     <label> Name  </label>
      <INPUT
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter name."
      />

    <label> Description  </label>
      <INPUT
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter description ."
      />
  
  <label> Type  </label>
      <INPUT
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Enter Qualification Type. Must be EXPERIENCE', 'EDUCATION', 'CERTIFICATION' or 'OTHERS"
      />


    <label> Date Obtained  </label>
      <INPUT
        type="text"
        name="date_obtained"
        value={formData.date_obtained}
        onChange={handleChange}
        placeholder="Enter Date Obtained ."
      />

    <div>
      <BLOCKBUTTON type="submit">Create Employee</BLOCKBUTTON>
    </div>
  </form>
  <ToastContainer />

</div>
  )
}

export default UpdateQualification