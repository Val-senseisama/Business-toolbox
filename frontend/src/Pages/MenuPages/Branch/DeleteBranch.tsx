import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_COMPANY_BRANCH } from '../../../GraphQL/Mutations';
import { BLOCKBUTTON } from '../../../Components/Forms';
import { PAGETITLE } from '../../../Components/Typography';
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../Helpers/Session';
import { APIResponse, Redirect } from '../../../Helpers/General';
import { useNavigate } from 'react-router-dom';

interface DeleteBranchProps {
  companyId: number;
  branchId: number;
}

const DeleteBranch: React.FC<DeleteBranchProps> = ({ companyId, branchId }) => {
    const navigate = useNavigate()
  const [deleteCompanyBranch] = useMutation(DELETE_COMPANY_BRANCH, {
    onCompleted: (data) => {
      if (data.deleteCompanyBranch) {
        Session.saveAlert("Branch deleted successfully.", "success");
        Session.showAlert({});
        Redirect("/dashboard")
        // navigate('/dashboard');
      } else {
        Session.saveAlert("Failed to delete branch.", "error");
        Session.showAlert({});
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error deleting branch. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(window.confirm("Are you sure you want to delete this branch?")){
      try {
        await deleteCompanyBranch({
          variables: { companyId, branchId },
        });
      } catch (e) {
        Session.saveAlert("delete operation failed. Please try again.", "error");
      }
    }
  
  };

  

  return (
    <div className="container">
      <PAGETITLE>Delete Company Branch</PAGETITLE>
      <p>Are you sure you want to delete this branch?</p>
      <BLOCKBUTTON onClick={handleDelete} type="submit">
        Delete Branch
      </BLOCKBUTTON>
      <ToastContainer />
    </div>
  );
};

export default DeleteBranch;
