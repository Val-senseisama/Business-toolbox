import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE } from '../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT, SELECT } from '../../../Components/Forms';
import { PAGETITLE } from '../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../Helpers/Session';
import { APIResponse } from "../../../Helpers/General";
import { Validate } from '../../../Helpers/Validate';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {

    
    const [user, setUser] = useState({
        title:"",
        firstname:"",
        lastname:"",
        email:"",
        phone:"",
        date_of_birth :"",
        gender:""
    });

    const [updateUser] = useMutation(UPDATE_PROFILE, {
        onCompleted: (data) => {
          if (data.updateProfile) {
            Session.saveAlert(" User Profile updated successfully.", "success");
            Session.showAlert({});
          } else {
            Session.saveAlert("Failed to update user Profile.", "error");
          }
        },
        onError: (error) => {
          APIResponse(error);
          if (Session.countAlert() < 1) {
            Session.saveAlert("Error creating company branch. Please try again.", "error");
          }
          Session.showAlert({});
          Session.removeAll();
        },
      });
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const doUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!Validate.string(user.title)) {
            Session.saveAlert(' Invalid Title.', 'error');
        };
        if (!Validate.string(user.firstname)) {
            Session.saveAlert(' Invalid First Name.', 'error');
        };
        if (!Validate.string(user.lastname)) {
            Session.saveAlert(' Invalid Last Name.', 'error');
        };
        if (!Validate.email(user.email)) {
            Session.saveAlert(' Invalid   Email.', 'error');
        };
        if (!Validate.phone(user.phone)) {
            Session.saveAlert(' Invalid Phone Number.', 'error');
        };
        if (!Validate.string(user.date_of_birth)) {
            Session.saveAlert(' Invalid date of birth.', 'error');
        };
        if (!Validate.string(user.gender)) {
            Session.saveAlert(' Invalid gender.', 'error');
        };
        if (Session.countAlert() > 0) {
            Session.showAlert({});
            return;
        };
    
        updateUser({
          variables: {
            ...user
          },
        });
      };


  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>REGISTER</PAGETITLE>
        <form onSubmit={doUpdateProfile}>
          <div className="row">
            <div className="col">
              <label>Title</label>
              <INPUT
                type="text"
                id="title"
                name="title"
                value={user.title}
                onChange={ handleChange }
                placeholder="Enter Title"
              />

              <label>Last Name</label>
              <INPUT
                type="text"
                id="lastname"
                name="lastname"
                value={user.lastname}
                onChange={ handleChange }
              
                placeholder="Enter your Last Name"
              />

              <label>Password</label>
              

              <label>Date of Birth</label>
              <INPUT
                type="text"
                id="date_of_birth"
                value={user.date_of_birth}
                onChange={ handleChange }
              />
            </div>

            <div className="col">
              <label>First Name</label>
              <INPUT
                type="text"
                id="firstname"
                name="firstname"
                value={user.firstname}
                onChange={ handleChange }
                placeholder="Enter your First Name"
              />

              <label>Email</label>
              <INPUT
                type="email"
                id="email"
                name="email"
                value={user.email}
                  onChange={ handleChange }
                placeholder="Enter email address"
              />

              <label>Phone Number</label>
              <INPUT
                type="text"
                name="phone"
                value={user.phone}
                onChange={ handleChange }
                placeholder="Enter your Phone Number  "
              />
              {/* <label>Gender</label>
             <SELECT  name='gender' onChange={handleChange} value={user.gender} required>
            <option value=''>----</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
             </SELECT> */}
              <label>Gender</label>
              <INPUT
                type="text"
                name="gender"
                placeholder="Enter Gender"
                value={user.gender}
                onChange={ handleChange }
              />
            </div>
          </div>

          <BLOCKBUTTON
            type="submit"
            className={
              Validate.email(user.email) ? "primary" : "inactive-primary"
            }
          >
            Update Profile
          </BLOCKBUTTON>
          <div className="text-center mt-3">
            <span className="text-muted">Already have an account?</span>
           
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default UpdateUser