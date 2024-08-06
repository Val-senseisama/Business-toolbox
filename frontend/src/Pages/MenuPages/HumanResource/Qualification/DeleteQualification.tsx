import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_QUALIFICATION } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse, Redirect } from '../../../../Helpers/General';
import { useNavigate } from 'react-router-dom';



interface DeleteQualificationProps {
    company_id: number;
    id: number;
  }

const DeleteQualification: React.FC<DeleteQualificationProps> = ({ company_id, id }) => {


    const navigate = useNavigate()
    const [deleteQualification] = useMutation(DELETE_QUALIFICATION,{
        onCompleted: (data) => {
            if (data.deleteDepartment) {
              Session.saveAlert("Department deleted successfully.", "success");
              Session.showAlert({});
              navigate("/");
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
            await deleteQualification({
              variables: { company_id, id },
            });
          } catch (e) {
            Session.saveAlert('Delete operation failed:', "error");
          }
        }
      };
  return (
    <div className="container">
      <PAGETITLE>Delete Department</PAGETITLE>
      <p>Are you sure you want to delete this Qualification?</p>
      <BLOCKBUTTON onClick={handleDelete} type="button">
        Delete Qualification
      </BLOCKBUTTON>
      <ToastContainer />
    </div>
  )
}

export default DeleteQualification