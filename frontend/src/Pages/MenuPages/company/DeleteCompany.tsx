import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DELETE_COMPANY } from "../../../GraphQL/Mutations";
import { BLOCKBUTTON } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";

const DeleteCompany: React.FC = () => {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const navigate = useNavigate();

  const [deleteCompany] = useMutation(DELETE_COMPANY, {
    onCompleted: () => {
      Session.saveAlert("Company deleted successfully.", "success");
      Session.showAlert({});
      // navigate("/company"); 
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

  // const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   if (!Validate.integer(companyId)) {
  //     Session.saveAlert("Invalid company ID.", "error");
  //     Session.showAlert({});
  //     return;
  //   }
  //   deleteCompany({ variables: { deleteCompanyId: companyId } });
  // };
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if(window.confirm("Are you sure you want to delete this branch?")){
      try {
        await deleteCompany({
          variables: { companyId },
        });
      } catch (e) {
        Session.saveAlert("delete operation failed. Please try again.", "error");
      }
    };
    if (!Validate.integer(companyId)) {
          Session.saveAlert("Invalid company ID.", "error");
          Session.showAlert({});
          return;
        }
  
  };

  return (
    <div className="container">
      <PAGETITLE>Delete Company</PAGETITLE>
      <p>Are you sure you want to delete this Company?</p>
        <div>
          <BLOCKBUTTON type="submit" onClick={handleDelete}>
            Delete Company
          </BLOCKBUTTON>
        </div>
      <ToastContainer />
    </div>
  );
};

export default DeleteCompany;
