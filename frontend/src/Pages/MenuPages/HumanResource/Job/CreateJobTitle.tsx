import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_JOB_TITLE } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse } from '../../../../Helpers/General';
import { Validate } from '../../../../Helpers/Validate';

const CreateJobTitle: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
      });

    const [jobTitle] = useMutation(CREATE_JOB_TITLE, {
        onCompleted: () => {
          Session.saveAlert("Job created successfully.", "success");
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

      const doJobTitle = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
        jobTitle({variables:{...formData}})
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
    <form onSubmit={doJobTitle}> 
      <label>Job Name</label>
      <INPUT
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter company Name."
      />
 
    <div>
  <label>Job Description</label>
  <INPUT
        type="text"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter JOb Description."
      />
    </div>
    <div>
      <BLOCKBUTTON type="submit">Create Job Title</BLOCKBUTTON>
    </div>
    </form>
    <ToastContainer/>
  </div>
  )
}

export default CreateJobTitle