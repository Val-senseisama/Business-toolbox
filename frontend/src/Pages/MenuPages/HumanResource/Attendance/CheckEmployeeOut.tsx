import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CHECK_EMPLOYEE_OUT } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse } from '../../../../Helpers/General';
import { Validate } from '../../../../Helpers/Validate';

const CheckEmployeeOut = () => {
    const [formData, setFormData] = useState({
        company_id: "",
        employee_id :""
         });
       const [checkIn] = useMutation(CHECK_EMPLOYEE_OUT,{
           onCompleted: () =>{
               Session.saveAlert("Employee checked out successfully.", "success");
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
    

       const doCheckOut = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!Validate.integer(formData.company_id)) {
            Session.saveAlert(' Invalid company_id.', 'error');
        };
        if(!Validate.integer(formData.employee_id)) {
            Session.saveAlert(' Invalid employee_id.', 'error');
        };
    
        if (Session.countAlert() > 0) {
            Session.showAlert({});
            return;
        }
     
       
        const variables = {
            company_id: parseInt(formData.company_id),
            employee_id : parseInt(formData.employee_id)
        }
        checkIn({variables: variables})
      };
   
  return (
    <div className="container">
    <PAGETITLE>CHECK EMPLOYEE OUT</PAGETITLE>
    <form onSubmit={doCheckOut}> 
      <label>Company ID</label>
      <INPUT
        type="text"
        id="company_id"
        name="company_id"
        value={formData.company_id}
        onChange={handleChange}
        placeholder="Enter company_id  ."
      />

    <label>Employee ID</label>
      <INPUT
        type="text"
        id="employee_id"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        placeholder="Enter employee_id  ."
      />
  
    <div>
      <BLOCKBUTTON type="submit">Check Out</BLOCKBUTTON>
    </div>
    </form>
    <ToastContainer/>
  </div>
  )
}

export default CheckEmployeeOut