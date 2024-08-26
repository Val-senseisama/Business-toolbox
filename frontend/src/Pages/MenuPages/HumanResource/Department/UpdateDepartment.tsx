import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_DEPARTMENT } from "../../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../../Components/Forms";
import { PAGETITLE } from "../../../../Components/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Session from "../../../../Helpers/Session";
import { APIResponse } from "../../../../Helpers/General";
import { Validate } from "../../../../Helpers/Validate";
import { useNavigate, useParams } from "react-router-dom";
import { GET_DEPARTMENTS } from "../../../../GraphQL/Queries";

const UpdateDepartment = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState({
    name: "",
    description: "",
  });

  const { data: departmentData, loading: departmentLoading, error: departmentError } = useQuery(GET_DEPARTMENTS, {
    variables: { departmentId: parseInt(departmentId ?? "", 10) },
  });

  useEffect(() => {
    if (departmentData && departmentData.department) {
      setDepartment({
        name: departmentData.department.name,
        description: departmentData.department.description,
      });
    }
    if (departmentError) {
      APIResponse(departmentError);
    }
  }, [departmentData, departmentError]);

  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
    onCompleted: (data) => {
      if (data.updateDepartment) {
        Session.saveAlert("Department updated successfully.", "success");
        Session.showAlert({});
        navigate("/departments");
      } else {
        Session.saveAlert("Failed to update department.", "error");
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error updating department. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleDepartmentUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


      if (!Validate.string(department.name)) {
        Session.saveAlert(`Invalid Department Name.`, "error");
      };
      if (!Validate.string(department.description)) {
        Session.saveAlert(`Invalid Description.`, "error");
      };

    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }

    const variables = {
      ...department,
      updateDepartmentId:parseInt(departmentId ?? "", 10),
    };
    updateDepartment({ variables:variables });
  };

  if (departmentLoading) return <p>Loading...</p>;

  return (
    <div>
      <ToastContainer />
      <PAGETITLE>Update Department</PAGETITLE>
      <form onSubmit={handleDepartmentUpdate}>
        <label>Department Name</label>
        <INPUT
          type="text"
          id="name"
          name="name"
          value={department.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDepartment({ ...department, name: e.target.value })
          }
          placeholder="Enter Department Name"
        />
        <label>Description</label>
        <TEXTAREA
          name="description"
          value={department.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDepartment({ ...department, description: e.target.value })
          }
          placeholder="Enter Description"
        />
        <div>
          <BLOCKBUTTON type="submit">Update Department</BLOCKBUTTON>
        </div>
      </form>
    </div>
  );
};

export default UpdateDepartment;
