import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UPDATE_VENDOR } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { PAGETITLE } from "../../../Components/Typography";
import { BLOCKBUTTON, INPUT } from "../../../Components/Forms";

interface VendorDetails {
  name: string;
  contact: string;
  address: string;
  phone: string;
  email: string;
}

interface FormData {
  companyId: string;
  branchId: string;
  details: VendorDetails;
}

const UpdateVendor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    companyId: "",
    branchId: "",
    details: {
      name: "",
      contact: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  const [UpdateVendor] = useMutation(UPDATE_VENDOR, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.updateVendor) {
        Session.saveAlert("Vendor updated successfully", "success");
        navigate("/vendors"); // Adjust this route as needed
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasErrors = false;

    if (!Validate.integer(formData.companyId)) {
      Session.saveAlert("Please enter a valid Company ID.", "error");
      hasErrors = true;
    }

    if (!Validate.integer(formData.branchId)) {
      Session.saveAlert("Please enter a valid Branch ID.", "error");
      hasErrors = true;
    }

    if (!formData.details.name.trim()) {
      Session.saveAlert("Please enter a valid Vendor Name.", "error");
      hasErrors = true;
    }

    if (!Validate.email(formData.details.email)) {
      Session.saveAlert("Please enter a valid Email.", "error");
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    setIsLoading(true);
    UpdateVendor({
      variables: {
        updateVendorId: parseInt(id || "0"),
        companyId: parseInt(formData.companyId),
        branchId: parseInt(formData.branchId),
        details: formData.details,
      },
    });
  };

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Update Vendor</PAGETITLE>
        <form onSubmit={handleSubmit}>
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
          <label>Vendor Name</label>
          <INPUT
            type="text"
            name="name"
            value={formData.details.name}
            onChange={handleInputChange}
            placeholder="Enter Vendor Name"
          />
          <label>Contact Person</label>
          <INPUT
            type="text"
            name="contact"
            value={formData.details.contact}
            onChange={handleInputChange}
            placeholder="Enter Contact Person"
          />
          <label>Address</label>
          <INPUT
            type="text"
            name="address"
            value={formData.details.address}
            onChange={handleInputChange}
            placeholder="Enter Address"
          />
          <label>Phone</label>
          <INPUT
            type="text"
            name="phone"
            value={formData.details.phone}
            onChange={handleInputChange}
            placeholder="Enter Phone"
          />
          <label>Email</label>
          <INPUT
            type="email"
            name="email"
            value={formData.details.email}
            onChange={handleInputChange}
            placeholder="Enter Email"
          />
          <BLOCKBUTTON
            type="submit"
            className={isLoading ? "inactive" : "primary"}
            disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Vendor"}
          </BLOCKBUTTON>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateVendor;
