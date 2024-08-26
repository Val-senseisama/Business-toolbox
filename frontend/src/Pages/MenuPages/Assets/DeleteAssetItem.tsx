import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DELETE_ASSET_ITEM } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { PAGETITLE } from "../../../Components/Typography";
import { BLOCKBUTTON, INPUT } from "../../../Components/Forms";

const DeleteAssetItem = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    deleteAssetItemId: "",
    companyId: "",
  });

  const [DeleteAssetItem] = useMutation(DELETE_ASSET_ITEM, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.deleteAssetItem) {
        Session.saveAlert("Asset item deleted successfully", "success");
        navigate("/asset-items");
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

    if (!Validate.integer(formData.deleteAssetItemId)) {
      Session.saveAlert("Please enter a valid Asset Item ID.", "error");
      hasErrors = true;
    }

    if (!Validate.integer(formData.companyId)) {
      Session.saveAlert("Please enter a valid Company ID.", "error");
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this asset item? This action cannot be undone.",
      )
    ) {
      setIsLoading(true);
      DeleteAssetItem({
        variables: {
          deleteAssetItemId: parseInt(formData.deleteAssetItemId),
          companyId: parseInt(formData.companyId),
        },
      });
    }
  };

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Delete Asset Item</PAGETITLE>
        <form onSubmit={handleDelete}>
          <label>Asset Item ID</label>
          <INPUT
            type="text"
            name="deleteAssetItemId"
            value={formData.deleteAssetItemId}
            onChange={handleInputChange}
            placeholder="Enter Asset Item ID"
          />
          <label>Company ID</label>
          <INPUT
            type="text"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            placeholder="Enter Company ID"
          />
          <BLOCKBUTTON
            type="submit"
            className={isLoading ? "inactive-danger" : "danger"}
            disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Asset Item"}
          </BLOCKBUTTON>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DeleteAssetItem;
