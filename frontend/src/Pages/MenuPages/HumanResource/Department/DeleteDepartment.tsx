import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_DEPARTMENT } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse, Redirect } from '../../../../Helpers/General';
import { useNavigate } from 'react-router-dom';

interface DeleteDepartmentProps {
  company_id: number;
  id: number;
}

const DeleteDepartment: React.FC<DeleteDepartmentProps> = ({ company_id, id }) => {
  const navigate = useNavigate();
  
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: (data) => {
      if (data.deleteDepartment) {
        Session.saveAlert("Department deleted successfully.", "success");
        Session.showAlert({});
        navigate("/dashboard");
        // Redirect("/dashboard"); 
      } else {
        Session.saveAlert("Failed to delete department.", "error");
        Session.showAlert({});
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error deleting department. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment({
          variables: { deleteDepartmentId: id, company_id},
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
  );
};

export default DeleteDepartment;
