import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DELETE_LEDGER } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { PAGETITLE } from "../../../Components/Typography";
import { BLOCKBUTTON, INPUT } from "../../../Components/Forms";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>
          Are you sure you want to delete this ledger? This action cannot be
          undone.
        </p>
        <button onClick={onConfirm}>Yes, delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
const DeleteLedger = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    companyId: "",
    deleteLedgerId: "",
  });

  const [DeleteLedger] = useMutation(DELETE_LEDGER, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.deleteLedger) {
        Session.saveAlert("Ledger deleted successfully", "success");
        navigate("/ledgers"); // Adjust this route as needed
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasErrors = false;

    if (!Validate.integer(formData.companyId)) {
      Session.saveAlert("Please enter a valid Company ID.", "error");
      hasErrors = true;
    }

    if (!Validate.integer(formData.deleteLedgerId)) {
      Session.saveAlert("Please enter a valid Ledger ID.", "error");
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setIsLoading(true);
    DeleteLedger({
      variables: {
        companyId: parseInt(formData.companyId),
        deleteLedgerId: parseInt(formData.deleteLedgerId),
      },
    });
    setShowConfirmModal(false);
  };

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Delete Ledger</PAGETITLE>
        <form onSubmit={handleDelete}>
          <label>Company ID</label>
          <INPUT
            type="text"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            placeholder="Enter Company ID"
          />
          <label>Ledger ID</label>
          <INPUT
            type="text"
            name="deleteLedgerId"
            value={formData.deleteLedgerId}
            onChange={handleInputChange}
            placeholder="Enter Ledger ID"
          />
          <BLOCKBUTTON
            type="submit"
            className={isLoading ? "inactive-danger" : "danger"}
            disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Ledger"}
          </BLOCKBUTTON>
        </form>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default DeleteLedger;
