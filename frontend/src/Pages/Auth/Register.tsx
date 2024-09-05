import React, { useState, useEffect } from "react";
import { BLOCKBUTTON, INPUT, PASSWORDINPUT } from "../../Components/Forms";
import { Validate } from "../../Helpers/Validate";
import { PAGETITLE } from "../../Components/Typography";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Session from "../../Helpers/Session";
import { ToastContainer } from "react-toastify";
import { APIResponse } from "../../Helpers/General";
import "react-toastify/dist/ReactToastify.css";
import { REGISTER } from "../../GraphQL/Mutations";
import logo from "../../assets/images/business-toolbox-icon.png"
import check from '../../assets/icons/check.png'
import nocheck from "../../assets/icons/nocheck.png"
// import { REGISTER } from "../../GraphQL/Mutations"; // Assuming this mutation exists

const Register = () => {
  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phonenumber: "",
    gender: "",
    dateOfBirth:"",
  });
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
  });


  

  const navigate = useNavigate();

  useEffect(() => {
    Session.remove("alerts");
  }, []);

    const [register, { loading }] = useMutation(REGISTER, {
      onCompleted: () => {
        Session.saveAlert('Registration successful!.', 'success');
        navigate("/activate");
      },
      onError: error => {
        if (error.networkError) {
          Session.saveAlert('Unable to connect to the server. Please check your internet connection and try again.', 'error');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          APIResponse(error);
          if (Session.countAlert() < 1) {
            Session.saveAlert('An error occurred during registration. Please try again.', 'error');
          }
        } else {
          Session.saveAlert('An unexpected error occurred. Please try again.', 'error');
        }
        Session.showAlert({});
      }
    });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === 'password') { 
          setValidations({
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            specialChar: /[0-9!@#$%^&*(),.?":{}|<>]/.test(value),
          });
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    Session.remove("alerts");
  };


  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let isValid = true;

    if (!Validate.string(formData.title)) {
      Session.saveAlert("Invalid Title  ", "error");
      isValid = false;
    }
    if (!Validate.string(formData.firstname)) {
      Session.saveAlert("Invalid First Name", "error");
      isValid = false;
    }
    if (!Validate.string(formData.lastname)) {
      Session.saveAlert("Invalid Last Name", "error");
      isValid = false;
    }
    if (!Validate.email(formData.email)) {
      Session.saveAlert("Invalid email", "error");
      isValid = false;
    }
    if (!Validate.string(formData.password) || !validations.length || !validations.specialChar || !validations.uppercase) {
      Session.saveAlert("Invalid Password", "error");
      isValid = false;
    }
    if (!Validate.formatPhone(formData.phonenumber)) {
      Session.saveAlert("Invalid phone number", "error");
      isValid = false;
    }

    if (!isValid) {
      Session.showAlert({});
    }
    
    register({ variables: { ...formData } });
    return isValid;
  };

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
            REGISTER
          </PAGETITLE>
          <p className="text-center">
            Please enter your credentials to create your account
          </p>
          <form
            onSubmit={handleRegister}
            className="col-10 col-sm-8 col-md-6 col-lg-5">
            <div>
              <label>Title</label>
              <INPUT
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange({
                    ...e,
                    target: { ...e.target, name: "title" },
                  })
                }
                placeholder="Enter Title"
              />
            </div>

            <div>
              <label>First Name</label>
              <INPUT
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange({
                    ...e,
                    target: { ...e.target, name: "firstname" },
                  })
                }
                placeholder="Enter your First Name"
              />
            </div>

            <div>
              <label>Last Name</label>
              <INPUT
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange({
                    ...e,
                    target: { ...e.target, name: "lastname" },
                  })
                }
                placeholder="Enter your Last Name"
              />
            </div>

            <div>
              <label>Email</label>
              <INPUT
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange({
                    ...e,
                    target: { ...e.target, name: "email" },
                  })
                }
                placeholder="Enter email address"
              />
            </div>

            <div>
  <label>Password</label>
  <PASSWORDINPUT
    type="password"
    name="password"
    id="password"
    value={formData.password}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange({
        ...e,
        target: { ...e.target, name: "password" },
      })
    }
    placeholder="Enter your password"
  />
  <div className="d-flex flex-row align-items-center">
    <img
      src={validations.length ? check : nocheck}
      alt="indicator"
    />
    <p className="text-small mt-3 mx-2">
      Password must be at least 8 characters long
    </p>
  </div>
  <div className="d-flex flex-row align-items-center">
    <img
      src={validations.uppercase ? check : nocheck}
      alt="indicator"
    />
    <p className="text-small mt-3 mx-2">
      Password must contain at least one uppercase letter
    </p>
  </div>
  <div className="d-flex flex-row align-items-center">
    <img
      src={validations.specialChar ? check : nocheck}
      alt="indicator"
    />
    <p className="text-small mt-3 mx-2">
      Password must contain at least one special character
    </p>
  </div>
</div>
            <div>
              <label>Gender</label>
              <INPUT
                type="text"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange({
                    ...e,
                    target: { ...e.target, name: "gender" },
                  })
                }
                placeholder="Enter your gender Male or Female"
              />
            </div>

            <div>
              <label>Phone Number</label>
              <INPUT
                type="text"
                value={formData.phonenumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange({
                    ...e,
                    target: { ...e.target, name: "phonenumber" },
                  })
                }
                placeholder="Enter your Phone Number (e.g 080)"
              />
            </div>

            <div>
              <label>Date of Birth</label>
              <INPUT
                type="text"
                value={formData.dateOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange({
                    ...e,
                    target: { ...e.target, name: "dateOfBirth" },
                  })
                }
                placeholder="Enter your date of birth YYYY-MM-DD"
              />
            </div>

            <BLOCKBUTTON
              type="submit"
              // className={
              //   Validate.email(formData.email) ? "primary" : "inactive-primary"
              // }
              className={
                Object.values(formData).every(Boolean)
                  ? "primary"
                  : "inactive-primary"
              }
              disabled={loading || !Object.values(formData).every(Boolean)}>
              {loading ? "Creating Account..." : "Create Account"}
            </BLOCKBUTTON>
            <div className="text-center mt-3">
              <span className="text-muted mx-2">Not new here?</span>
              <Link className="text-primary" to="/login">
                Login
              </Link>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;