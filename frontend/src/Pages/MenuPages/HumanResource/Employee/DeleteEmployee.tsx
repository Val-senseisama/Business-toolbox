import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_EMPLOYEE } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse, Redirect } from '../../../../Helpers/General';
import { useNavigate } from 'react-router-dom';



interface DeleteEmployeeProps {
  companyId: number;
  employeeId: number;
}

const DeleteEmployee: React.FC<DeleteEmployeeProps> = ({ employeeId, companyId }) => {
  const navigate = useNavigate();
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE,{
    onCompleted:(data)=>{
      if (data.deleteEmployee) {
        Session.saveAlert("Employee deleted successfully.", "success");
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
    }
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteEmployee({
          variables: { employeeId, companyId },
        });
      } catch (e) {
        Session.saveAlert('Delete operation failed:', "error");
      }
    }
  };
  return (
    <div className="container">
    <PAGETITLE>Delete Employee</PAGETITLE>
    <p>Are you sure you want to delete this employee?</p>
    <BLOCKBUTTON onClick={handleDelete} type="button">
      Delete Employee
    </BLOCKBUTTON>
    <ToastContainer />
  </div>
  )
}

export default DeleteEmployee;