import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {UPDATE_JOB_TITLE } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT,SELECT, TEXTAREA} from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse } from '../../../../Helpers/General';
import { Validate } from '../../../../Helpers/Validate';
import { GET_JOB_TITLE } from '../../../../GraphQL/Queries';
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from '../../../../Components/Loading';


const UpdateJobTitle = () => {

  const { updateJobTitleId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
});

const { data: jobTitleData, loading: JobTitleLoading, error: TitleError } = useQuery(GET_JOB_TITLE, {
  variables: { employeeId: parseInt(updateJobTitleId ?? "", 10) },
});

useEffect(() => {
  if (jobTitleData && jobTitleData.employee) {
    setFormData({
      name: jobTitleData.employee.name,
      description: jobTitleData.employee.description,
    });
  }
  if (TitleError) {
    APIResponse(TitleError);
  }
}, [jobTitleData, TitleError]);
    const [updateTitle] = useMutation(UPDATE_JOB_TITLE,{
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

 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };

      const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
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
        updateTitle({variables:{...formData}})
      };

      if(JobTitleLoading){
        return <Loading/>
      }

  return (
    <div> 
    <PAGETITLE>Update Job Title</PAGETITLE>
    <form onSubmit={handleUpdate}>
     <label> Name  </label>
      <INPUT
        type="text"
        name="name"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, name: e.target.value })
        }
    
        placeholder="Enter Job name."
      />

    <label> Description  </label>
    <TEXTAREA
          name="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter Description"
        />
    <div>
      <BLOCKBUTTON type="submit">Update Job Title</BLOCKBUTTON>
    </div>
  </form>
  <ToastContainer />

</div>
  )
}

export default UpdateJobTitle