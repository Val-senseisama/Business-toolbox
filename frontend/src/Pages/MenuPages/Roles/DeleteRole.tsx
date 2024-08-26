import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_ROLE } from '../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT, TEXTAREA } from '../../../Components/Forms';
import { PAGETITLE } from '../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../Helpers/Session';
import { APIResponse } from "../../../Helpers/General";
import { Validate } from '../../../Helpers/Validate';
import { useNavigate } from 'react-router-dom';

const DeleteRole = () => {
    const [deleteRole] = useMutation(DELETE_ROLE,{
        onCompleted: (data) => {
            if (data.deleteRole) {
              Session.saveAlert("Role deleted successfully.", "success");
              Session.showAlert({});
            } else {
              Session.saveAlert("Failed to delete role.", "error");
            }
          },
          onError: (error) => {
            APIResponse(error);
            if (Session.countAlert() < 1) {
              Session.saveAlert("Error deleting role. Please try again.", "error");
            }
            Session.showAlert({});
            Session.removeAll();
          },
    });
    const [id, setId] = useState("")
    const navigate = useNavigate();
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!Validate.integer(id)) {
          Session.saveAlert("Invalid role ID.", "error");
          Session.showAlert({});
          return;
        }
        deleteRole({ variables: { id } });
        navigate('/roles');
      };


  return (
    <div>
      <ToastContainer />
      <PAGETITLE>Delete Role</PAGETITLE>
      <p>Are you sure you want to delete this Role?</p>
      <BLOCKBUTTON type="submit" onClick={handleDelete}>
        Delete Role
      </BLOCKBUTTON>
    </div>
  )
}

export default DeleteRole