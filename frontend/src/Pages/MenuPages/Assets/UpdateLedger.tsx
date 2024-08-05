import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UPDATE_LEDGER } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { PAGETITLE } from "../../../Components/Typography";
import { BLOCKBUTTON, INPUT } from "../../../Components/Forms";

const UpdateLedger = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    updateLedgerId: "",
    companyId: "",
    branchId: "",
    details: {
      type: "",
      category: "",
      balance: "",
    },
  });

  const [UpdateLedger] = useMutation(UPDATE_LEDGER, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.updateLedger) {
        Session.saveAlert("Ledger updated successfully", "success");
        navigate("/ledgers");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("An error occurred. Please try again.", "error");
      }
      Session.showAlert({});
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in formData.details) {
      setFormData((prevData) => ({
        ...prevData,
        details: {
          ...prevData.details,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasErrors = false;

    if (!formData.updateLedgerId.trim()) {
      Session.saveAlert("Please enter a Ledger ID.", "error");
      hasErrors = true;
    }

    if (!Validate.integer(formData.companyId)) {
      Session.saveAlert("Please enter a valid Company ID.", "error");
      hasErrors = true;
    }

    if (!Validate.integer(formData.branchId)) {
      Session.saveAlert("Please enter a valid Branch ID.", "error");
      hasErrors = true;
    }

    if (!formData.details.type) {
      Session.saveAlert("Please enter a valid Type.", "error");
      hasErrors = true;
    }

    if (!formData.details.category) {
      Session.saveAlert("Please enter a valid Category.", "error");
      hasErrors = true;
    }

    if (!Validate.float(formData.details.balance)) {
      Session.saveAlert("Please enter a valid Balance.", "error");
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    setIsLoading(true);
    UpdateLedger({
      variables: {
        updateLedgerId: formData.updateLedgerId,
        companyId: parseInt(formData.companyId),
        branchId: parseInt(formData.branchId),
        details: {
          type: formData.details.type,
          category: formData.details.category,
          balance: parseFloat(formData.details.balance),
        },
      },
    });
  };

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Update Ledger</PAGETITLE>
        <form onSubmit={handleUpdate}>
          <label>Ledger ID</label>
          <INPUT
            type="text"
            name="updateLedgerId"
            value={formData.updateLedgerId}
            onChange={handleInputChange}
            placeholder="Enter Ledger ID"
          />
          <label>Company ID</label>
          <INPUT
            type="text"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            placeholder="Enter Company ID"
          />
          <label>Branch ID</label>
          <INPUT
            type="text"
            name="branchId"
            value={formData.branchId}
            onChange={handleInputChange}
            placeholder="Enter Branch ID"
          />
          <label>Type</label>
          <INPUT
            type="text"
            name="type"
            value={formData.details.type}
            onChange={handleInputChange}
            placeholder="Enter Type"
          />
          <label>Category</label>
          <INPUT
            type="text"
            name="category"
            value={formData.details.category}
            onChange={handleInputChange}
            placeholder="Enter Category"
          />
          <label>Balance</label>
          <INPUT
            type="text"
            name="balance"
            value={formData.details.balance}
            onChange={handleInputChange}
            placeholder="Enter Balance"
          />
          <BLOCKBUTTON
            type="submit"
            className={isLoading ? "inactive" : "primary"}
            disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Ledger"}
          </BLOCKBUTTON>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateLedger;
