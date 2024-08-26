import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UPDATE_ASSET_ITEM } from "../../../GraphQL/Mutations";
import { GET_ASSET_ITEM } from "../../../GraphQL/Queries"; // Assuming you have this query
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { PAGETITLE } from "../../../Components/Typography";
import { BLOCKBUTTON, INPUT, SELECT } from "../../../Components/Forms";

const UpdateAssetItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [assetData, setAssetData] = useState({
    updateAssetItemId:id ? parseInt(id) : 0,
    companyId: 0,
    branchId: 0,
    vendorId: 0,
    locationId: 0,
    categoryId: 0,
    tag: "",
    serialNumber: "",
    name: "",
    description: "",
    purchaseDate: "",
    purchaseCost: 0,
    latestValue: 0,
    status: "",
  });

  const { loading, error, data } = useQuery(GET_ASSET_ITEM, {
    variables: { id: id ? parseInt(id): 0 },
    onCompleted: (data) => {
      if (data.getAssetItem) {
        setAssetData((prevData) => ({
          ...prevData,
          ...data.getAssetItem,
          updateAssetItemId: id ? parseInt(id) : 0,
        }));
      }
    },
  });

  const [UpdateAssetItem] = useMutation(UPDATE_ASSET_ITEM, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.updateAssetItem) {
        Session.saveAlert("Asset item updated successfully", "success");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAssetData((prevData) => ({
      ...prevData,
      [name]: [
        "companyId",
        "branchId",
        "vendorId",
        "locationId",
        "categoryId",
      ].includes(name)
        ? parseInt(value)
        : ["purchaseCost", "latestValue"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasErrors = false;

    // Add validation for each field
    if (!Validate.integer(assetData.companyId)) {
      Session.saveAlert("Please enter a valid company ID.", "error");
      hasErrors = true;
    }
    if (!Validate.integer(assetData.branchId)) {
      Session.saveAlert("Please enter a valid branch ID.", "error");
      hasErrors = true;
    }
    if (!Validate.integer(assetData.vendorId)) {
      Session.saveAlert("Please enter a valid vendor ID.", "error");
      hasErrors = true;
    }
    if (!Validate.integer(assetData.locationId)) {
      Session.saveAlert("Please enter a valid location ID.", "error");
      hasErrors = true;
    }
    if (!Validate.integer(assetData.categoryId)) {
      Session.saveAlert("Please enter a valid category ID.", "error");
      hasErrors = true;
    }
    if (!Validate.string(assetData.tag)) {
      Session.saveAlert("Please enter a valid tag.", "error");
      hasErrors = true;
    }
    if (!Validate.string(assetData.serialNumber)) {
      Session.saveAlert("Please enter a valid serial number.", "error");
      hasErrors = true;
    }
    if (!Validate.string(assetData.name)) {
      Session.saveAlert("Please enter a valid asset name.", "error");
      hasErrors = true;
    }
    if (!Validate.string(assetData.description)) {
      Session.saveAlert("Please enter a valid description.", "error");
      hasErrors = true;
    }
    if (!Validate.date(assetData.purchaseDate)) {
      Session.saveAlert("Please enter a valid purchase date.", "error");
      hasErrors = true;
    }
    if (!Validate.float(assetData.purchaseCost)) {
      Session.saveAlert("Please enter a valid purchase cost.", "error");
      hasErrors = true;
    }
    if (!Validate.float(assetData.latestValue)) {
      Session.saveAlert("Please enter a valid latest value.", "error");
      hasErrors = true;
    }
    if (!Validate.string(assetData.status)) {
      Session.saveAlert("Please select a valid status.", "error");
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    setIsLoading(true);
    UpdateAssetItem({ variables: assetData });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Update Asset Item</PAGETITLE>
        <form onSubmit={handleSubmit}>
          <label>Company ID</label>
          <INPUT
            type="number"
            name="companyId"
            value={assetData.companyId}
            onChange={handleChange}
            placeholder="Enter company ID"
          />
          <label>Branch ID</label>
          <INPUT
            type="number"
            name="branchId"
            value={assetData.branchId}
            onChange={handleChange}
            placeholder="Enter branch ID"
          />
          <label>Vendor ID</label>
          <INPUT
            type="number"
            name="vendorId"
            value={assetData.vendorId}
            onChange={handleChange}
            placeholder="Enter vendor ID"
          />
          <label>Location ID</label>
          <INPUT
            type="number"
            name="locationId"
            value={assetData.locationId}
            onChange={handleChange}
            placeholder="Enter location ID"
          />
          <label>Category ID</label>
          <INPUT
            type="number"
            name="categoryId"
            value={assetData.categoryId}
            onChange={handleChange}
            placeholder="Enter category ID"
          />
          <label>Tag</label>
          <INPUT
            type="text"
            name="tag"
            value={assetData.tag}
            onChange={handleChange}
            placeholder="Enter asset tag"
          />
          <label>Serial Number</label>
          <INPUT
            type="text"
            name="serialNumber"
            value={assetData.serialNumber}
            onChange={handleChange}
            placeholder="Enter serial number"
          />
          <label>Name</label>
          <INPUT
            type="text"
            name="name"
            value={assetData.name}
            onChange={handleChange}
            placeholder="Enter asset name"
          />
          <label>Description</label>
          <INPUT
            type="text"
            name="description"
            value={assetData.description}
            onChange={handleChange}
            placeholder="Enter asset description"
          />
          <label>Purchase Date</label>
          <INPUT
            type="date"
            name="purchaseDate"
            value={assetData.purchaseDate}
            onChange={handleChange}
          />
          <label>Purchase Cost</label>
          <INPUT
            type="number"
            name="purchaseCost"
            value={assetData.purchaseCost}
            onChange={handleChange}
            placeholder="Enter purchase cost"
          />
          <label>Latest Value</label>
          <INPUT
            type="number"
            name="latestValue"
            value={assetData.latestValue}
            onChange={handleChange}
            placeholder="Enter latest value"
          />
          <label>Status</label>
          <SELECT name="status" onChange={handleChange} className="">
            <option value="">Select status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DISPOSED">Disposed</option>
          </SELECT>
          <BLOCKBUTTON
            type="submit"
            className={isLoading ? "inactive-primary" : "primary"}
            disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Asset Item"}
          </BLOCKBUTTON>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateAssetItem;
