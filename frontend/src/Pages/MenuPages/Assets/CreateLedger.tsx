import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CREATE_LEDGER } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { PAGETITLE } from "../../../Components/Typography";
import { BLOCKBUTTON, INPUT, SELECT } from "../../../Components/Forms";

const CreateLedger = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState({
    companyId: "",
    branchId: "",
    details: {
      name: "",
      code: "",
      description: "",
    },
    type: "",
  });

  const [CreateLedger] = useMutation(CREATE_LEDGER, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.createLedger) {
        Session.saveAlert("Ledger created successfully", "success");
        navigate("/ledgers"); // Adjust this path as needed
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name in ledgerData.details) {
      setLedgerData((prevData) => ({
        ...prevData,
        details: {
          ...prevData.details,
          [name]: value,
        },
      }));
    } else {
      setLedgerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasErrors = false;

    if (!Validate.integer(ledgerData.companyId)) {
      Session.saveAlert("Please enter a valid Company ID.", "error");
      hasErrors = true;
    }
    if (!Validate.integer(ledgerData.branchId)) {
      Session.saveAlert("Please enter a valid Branch ID.", "error");
      hasErrors = true;
    }
    if (!Validate.string(ledgerData.details.name)) {
      Session.saveAlert("Please enter a valid ledger name.", "error");
      hasErrors = true;
    }
    if (!Validate.string(ledgerData.details.code)) {
      Session.saveAlert("Please enter a valid ledger code.", "error");
      hasErrors = true;
    }
    if (!Validate.string(ledgerData.type)) {
      Session.saveAlert("Please select a valid account type.", "error");
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    setIsLoading(true);
    CreateLedger({
      variables: {
        companyId: parseInt(ledgerData.companyId),
        branchId: parseInt(ledgerData.branchId),
        details: ledgerData.details,
        type: ledgerData.type,
      },
    });
  };

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Create Ledger</PAGETITLE>
        <form onSubmit={handleSubmit}>
          <label>Company ID</label>
          <INPUT
            type="text"
            name="companyId"
            value={ledgerData.companyId}
            onChange={handleInputChange}
            placeholder="Enter Company ID"
          />
          <label>Branch ID</label>
          <INPUT
            type="text"
            name="branchId"
            value={ledgerData.branchId}
            onChange={handleInputChange}
            placeholder="Enter Branch ID"
          />
          <label>Ledger Name</label>
          <INPUT
            type="text"
            name="name"
            value={ledgerData.details.name}
            onChange={handleInputChange}
            placeholder="Enter Ledger Name"
          />
          <label>Ledger Code</label>
          <INPUT
            type="text"
            name="code"
            value={ledgerData.details.code}
            onChange={handleInputChange}
            placeholder="Enter Ledger Code"
          />
          <label>Description</label>
          <INPUT
            type="text"
            name="description"
            value={ledgerData.details.description}
            onChange={handleInputChange}
            placeholder="Enter Description"
          />
          <label>Account Type</label>
          <SELECT name="type" onChange={handleInputChange} className="">
            <option value="">Select Account Type</option>
            <option value="ASSET">Asset</option>
            <option value="LIABILITY">Liability</option>
            <option value="EQUITY">Equity</option>
            <option value="REVENUE">Revenue</option>
            <option value="EXPENSE">Expense</option>
          </SELECT>
          <BLOCKBUTTON
            type="submit"
            className={isLoading ? "inactive-primary" : "primary"}
            disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Ledger"}
          </BLOCKBUTTON>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateLedger;
