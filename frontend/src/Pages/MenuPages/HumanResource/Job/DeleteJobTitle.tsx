import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_JOB_TITLE } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse, Redirect } from '../../../../Helpers/General';
import { useNavigate } from 'react-router-dom';


interface DeleteJobTitleProps {
    company_id: number;
    id: number;
  }

const DeleteJobTitle: React.FC<DeleteJobTitleProps> = ({ company_id, id }) => {
    const navigate = useNavigate();
  const [deleteJobTitle] = useMutation(DELETE_JOB_TITLE, {
    onCompleted: (data) => {
      if (data.deleteJobTitle) {
        Session.saveAlert("Job Title deleted successfully.", "success");
        Session.showAlert({});
        navigate("/job");
        // Redirect("/dashboard"); 
      } else {
        Session.saveAlert("Failed to delete job title.", "error");
        Session.showAlert({});
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error deleting JOb Title. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this Job Title?")) {
      try {
        await deleteJobTitle({
          variables: { id, company_id},
        });
      } catch (e) {
        Session.saveAlert('Delete operation failed:', "error");
      } 
    }
  };
    
  return (
    <div className="container">
    <PAGETITLE>Delete Department</PAGETITLE>
    <p>Are you sure you want to delete this department?</p>
    <BLOCKBUTTON onClick={handleDelete} type="button">
      Delete Department
    </BLOCKBUTTON>
    <ToastContainer />
  </div>
  )
}

export default DeleteJobTitle