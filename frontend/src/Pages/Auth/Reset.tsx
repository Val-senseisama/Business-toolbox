import React, { useState } from 'react'
import { PAGETITLE } from '../../Components/Typography'
import { BLOCKBUTTON, CUSTOMBLOCKBUTTON, INPUT, PASSWORDINPUT } from '../../Components/Forms'
import Session from '../../Helpers/Session'
import { Validate } from '../../Helpers/Validate'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RESET_PASSWORD } from '../../GraphQL/Mutations'
import { APIResponse } from '../../Helpers/General'
import logo from "../../assets/images/business-toolbox-icon.png"
import check from "../../assets/icons/check.png";
import nocheck from "../../assets/icons/nocheck.png";

const Reset = () => {
  const [ resetData, setResetData ] = React.useState({
    email: "",
    password: "",
    token: ""
  })
  const [ confimPassword, setConfirmPassword ] = React.useState("")
  const [ passwordConfirmed, setPasswordConfirmed ] = React.useState(false)
  const [resetDone, setResetDone] = React.useState(false)
    const [validations, setValidations] = useState({
      length: false,
      uppercase: false,
      specialChar: false,
    });

    const navigate = useNavigate(); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "password") {
          setPasswordConfirmed(value === confimPassword);
          setValidations({
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            specialChar: /[0-9!@#$%^&*(),.?":{}|<>]/.test(value),
          });
        }
      if (name === 'confirm-password') {
        setConfirmPassword(value);
        setPasswordConfirmed(value === resetData.password);
      }
      

      setResetData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        Session.remove("alerts");
      };

    const [resetPassword, {loading}] = useMutation(RESET_PASSWORD,{
      onCompleted: (data) => {
           if (data.resetPassword) {
                Session.saveAlert('Password reset successfully' ,'success');         
             setResetDone(true);
           }
           Session.showAlert({});
        },
      onError: (error) => {
            APIResponse(error);
            if (Session.countAlert() < 1) {
                Session.saveAlert('#GENERIC_ERROR', 'error');
            }else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                APIResponse(error);
                if (Session.countAlert() < 1) {
                    Session.saveAlert('An error occurred. Please try again.', 'error');
                }
            }else{
                Session.removeAll();
            }
        
              Session.showAlert({});
        }
    });
   
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let hasErrors = true;

        if (!Validate.email(resetData.email)) {
            Session.saveAlert('Please enter a valid email address.', 'error');
            hasErrors = false;
        }
        if (!Validate.string(resetData.password)) {
            Session.saveAlert('Please enter your password.', 'error');
          hasErrors = false;
        }
        if (!Validate.string(resetData.token)) {
            Session.saveAlert('Please enter token.', 'error');
            hasErrors = false;
        }
        if (!hasErrors) {
            Session.showAlert({});
      }
      try {
      resetPassword({variables: { ...resetData }});
      } catch (error) {
        console.log(error);
        
      }
      
        return hasErrors;

    }
  
  
  return (
    <div>
      <div className="row">
        <div className="py-3 col-12 col-lg-6 d-flex d-lg-block w-100 justify-content-center border-bottom">
          <Link to="/" className="navbar-brand">
            <img
              src={logo}
              alt="Business Toolbox"
              className="px-5 py-3 img-fluid"
            />
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="w3-animate-left pb-5 d-flex flex-column justify-items-center mt-5 align-items-center">
          <PAGETITLE className="text-center my-3 fs-3 fw-bold">
            {resetDone? "Password Updated!" :"Reset Password"}
          </PAGETITLE>
          <div className="text-start">
            {resetDone ? "Your password has been successfully reset. Click below to log in": "Type the reset code that was sent to your email along with your new password" }
          </div>
          {resetDone ? <CUSTOMBLOCKBUTTON
            onClick={() => navigate("/login")}
            className="text-primary"
          >
            Back to Login
        </CUSTOMBLOCKBUTTON>:(  <form
            onSubmit={handleSubmit}
            className="col-10 col-sm-8 col-md-6 col-lg-5">
            <label className="fw-bold fs-6">Email</label>
            <INPUT
              type="email"
              name="email"
              value={resetData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "email" },
                })
              }
              placeholder="Enter email address"
            />
            <label className="fw-bold fs-6">New Password</label>
            <PASSWORDINPUT
              type="password"
              value={resetData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "password" },
                })
              }
              className={!passwordConfirmed && "border-danger"}
              placeholder="Enter new password"
            />
            <label className="fw-bold fs-6">Retype New Password</label>
            <PASSWORDINPUT
              type="password"
              value={confimPassword}
              className={!passwordConfirmed && "border-danger"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "confirm-password" },
                })
              }
              placeholder="Retype new password"
            />
            <div className="d-flex mt-1 flex-row align-items-center">
              <img src={validations.length ? check : nocheck} alt="indicator" />
              <p className="text-small my-0 mx-2">
                Password must be at least 8 characters long
              </p>
            </div>
            <div className="d-flex mt-1 flex-row align-items-center">
              <img
                src={validations.uppercase ? check : nocheck}
                alt="indicator"
              />
              <p className="text-small my-0 mx-2">
                Password must contain at least one uppercase letter
              </p>
            </div>
            <div className="d-flex mt-1 flex-row align-items-center">
              <img
                src={validations.specialChar ? check : nocheck}
                alt="indicator"
                className=" img-fluid"
              />
              <p className="text-small my-0 mx-2">
                Password must contain at least one special character
              </p>
            </div>
            <label className="fw-bold fs-6">Token</label>
            <INPUT
              type="text"
              value={resetData.token}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "token" },
                })
              }
              placeholder="Enter token  "
            />
            <BLOCKBUTTON
              type="submit"
              className={
                Validate.email(resetData.email) ? "primary" : "inactive-primary"
              }
              disabled={loading}>
              Submit
            </BLOCKBUTTON>
          </form>)}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Reset