import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_PERFORMANCE_REVIEW } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse, Redirect } from '../../../../Helpers/General';
import { useNavigate } from 'react-router-dom';



interface DeletePerformanceProps {
    company_id: number;
    id: number;
  }
const DeletePerformance : React.FC<DeletePerformanceProps> = ({ company_id, id }) => {
    const navigate = useNavigate();
    const [deletePerformance] = useMutation(DELETE_PERFORMANCE_REVIEW, {
      onCompleted: (data) => {
        if (data.deletePerformanceReview) {
          Session.saveAlert(" Performance Review deleted successfully.", "success");
          Session.showAlert({});
          navigate("/");
          // Redirect("/dashboard"); 
        } else {
          Session.saveAlert("Failed to delete performance review.", "error");
          Session.showAlert({});
        }
      },
      onError: (error) => {
        APIResponse(error);
        if (Session.countAlert() < 1) {
          Session.saveAlert("Error deleting Performance Review. Please try again.", "error");
        }
        Session.showAlert({});
        Session.removeAll();
      },
    });

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this review?")) {
          try {
            await deletePerformance({
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
    <p>Are you sure you want to delete this Review?</p>
    <BLOCKBUTTON onClick={handleDelete} type="button">
      Delete Department
    </BLOCKBUTTON>
    <ToastContainer />
  </div>
  )
}

export default DeletePerformance