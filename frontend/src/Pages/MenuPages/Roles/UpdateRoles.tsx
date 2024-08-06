import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_ROLE } from "../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { useNavigate, useParams } from "react-router-dom";
import { GET_COMPANY_ROLES } from "../../../GraphQL/Queries";

const UpdateRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [json, setJson] = useState({});
  const [status, setStatus] = useState("");

  const { data: roleData, loading: roleLoading, error: roleError } = useQuery(GET_COMPANY_ROLES, {
    variables: { id:parseInt(id ?? "", 10) },
  });

  useEffect(() => {
    if (roleData && roleData.role) {
      setName(roleData.role.name);
      setJson(roleData.role.json);
      setStatus(roleData.role.status);
    }
    if (roleError) {
      APIResponse(roleError);
    }
  }, [roleData, roleError]);

  const [updateRole] = useMutation(UPDATE_ROLE, {
    onCompleted: (data) => {
      if (data.updateRole) {
        Session.saveAlert("Role updated successfully.", "success");
        Session.showAlert({});
        navigate("/roles");
      } else {
        Session.saveAlert("Failed to update role.", "error");
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error updating role. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleRoleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!Validate.string(name)) {
      Session.saveAlert("Invalid Role.", "error");
    }

    if (!Validate.array(json)) {
      Session.saveAlert("JSON permissions are required", "error");
    }

    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }

    const variables = {
      updateRoleId: parseInt(id ?? '', 10),
      name,
      json,
      status,
    };
    updateRole({ variables:variables });
  };

  if (roleLoading) return <p>Loading...</p>;

  return (
    <div>
      <ToastContainer />
      <PAGETITLE>Update Role</PAGETITLE>
      <form onSubmit={handleRoleUpdate}>
        <label>Name of Role</label>
        <INPUT
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          placeholder="Enter Role Name"
        />
        <label>Permissions :(json)</label>
        <TEXTAREA
          name="json"
          value={JSON.stringify(json)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setJson(e.target.value)
          }
          placeholder="Enter JSON permissions"
        />
        <label>Status</label>
        <INPUT
          type="text"
          id="status"
          name="status"
          value={status}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStatus(e.target.value)
          }
          placeholder="Enter Status"
        />
        <div>
          <BLOCKBUTTON type="submit">Update Role</BLOCKBUTTON>
        </div>
      </form>
    </div>
  );
};

export default UpdateRole;