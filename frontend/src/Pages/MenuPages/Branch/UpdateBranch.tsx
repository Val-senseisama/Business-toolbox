import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_COMPANY_BRANCH } from "../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { useNavigate, useParams } from "react-router-dom";
import { GET_COMPANY_BRANCHES } from "../../../GraphQL/Queries";
import { Loading } from "../../../Components/Loading";

const UpdateCompanyBranch = () => {
  const { companyId, branchId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [settings, setSettings] = useState({});

  const { data: branchData, loading: branchLoading, error: branchError } = useQuery(GET_COMPANY_BRANCHES, {
    variables: {
      companyId: parseInt(companyId ?? "", 10),
      branchId: parseInt(branchId ?? "", 10),
    },
  });

  useEffect(() => {
    if (branchData?.companyBranch) {
      setName(branchData.companyBranch.name);
      setDescription(branchData.companyBranch.description);
      setSettings(branchData.companyBranch.settings);
    }
    if (branchError) {
      APIResponse(branchError);
    }
  }, [branchData, branchError]);

  const [updateBranch] = useMutation(UPDATE_COMPANY_BRANCH, {
    onCompleted: (data) => {
      if (data.updateCompanyBranch) {
        Session.saveAlert("Branch updated successfully.", "success");
        Session.showAlert({});
        navigate("/branches");
      } else {
        Session.saveAlert("Failed to update branch.", "error");
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error updating branch. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleBranchUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!Validate.string(name)) {
      Session.saveAlert("Invalid Branch Name.", "error");
    }

    if (!Validate.string(description)) {
      Session.saveAlert("Description is required", "error");
    }

    // if (!Validate.array(settings)) {
    //   Session.saveAlert("Settings are required", "error");
    // }

    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }

    const variables = {
      companyId: parseInt(companyId ?? "", 10),
      branchId: parseInt(branchId ?? "", 10),
      name,
      description,
      settings,
    };
    updateBranch({ variables });
  };

  if (branchLoading) return <Loading/>;

  return (
    <div className="container">
      <ToastContainer />
      <PAGETITLE>Update Company Branch</PAGETITLE>
      <form onSubmit={handleBranchUpdate}>
        <label>Branch Name</label>
        <INPUT
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          placeholder="Enter Branch Name"
        />
        <label>Description</label>
        <TEXTAREA
          name="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="Enter Description"
        />
        {/* <label>Settings (JSON)</label>
        <TEXTAREA
          name="settings"
          value={JSON.stringify(settings)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setSettings(e.target.value)
          }
          placeholder="Enter Settings JSON"
        /> */}
        <div>
          <BLOCKBUTTON type="submit">Update Branch</BLOCKBUTTON>
        </div>
      </form>
    </div>
  );
};

export default UpdateCompanyBranch;