// import React, { useState } from "react";
// import { BLOCKBUTTON, INPUT } from "../../Components/Forms";
// import { Validate } from "../../Helpers/Validate";
// import { PAGETITLE } from "../../Components/Typography";
// import { Link } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import Session from "../../Helpers/Session";
// import { APIResponse } from "../../Helpers/General";
// import { ToastContainer } from 'react-toastify';

// const Forgot = () => {
//   const [email, setEmail] = useState("");
//   const [step, setStep] = useState(1);

//   // const [ForgetPassword, {loading,data}] = useMutation(FORGET_PASSWORD,{
//   //     onCompleted: (data) => {
//   //         if (data.forgotPassword) {
//   //             Session.saveAlert('Email sent successfully', 'success');
//   //         }
//   //     },
//   //     onError: (error) => {
//   //         APIResponse(error);
//   //         if (Session.countAlert() < 1) {
//   //             Session.saveAlert('#GENERIC_ERROR', 'error');
//   //         }
//   //         else{
//   //             Session.removeAll();
//   //         }
//   //         // Session.showAlert();
//   //     }
//   // });

//   // const handleForgetPassword = (event: Event) => {
//   //     event.preventDefault();
//   //     if (Validate.email(email)) {
//   //         // forgetPassword({ variables: { email } });
//   //     }
//   //     else {
//   //         Session.saveAlert('#INVALID_EMAIL', 'error');
//   //     };

//   //     ForgetPassword({ variables: { email } });

//   // }

//   return (
//     <div className="container">
//       <div className="w3-animate-left">
//         <div className="d-flex flex-wrap align-content-center">
//           <Link className="dark me-5 fs-3 mt-3" to="/login">
//             <i className="bi bi-arrow-left"></i>
//           </Link>
//         </div>
//         <form>
//           <PAGETITLE>FORGOT PASSWORD</PAGETITLE>
//           <label>Enter Your Email address</label>
//           <INPUT
//             type="email"
//             value={email}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               setEmail(e.target.value)
//             }
//             placeholder="Enter email address"
//           />
//           {email.includes("@") && !Validate.email(email) ? (
//             <div className="text-error text-small mt-3 mb-4">
//               <i className="bi bi-exclamation-triangle-fill"></i> Incorrect
//               email address
//             </div>
//           ) : (
//             <div className="text-muted text-small mt-3 mb-4">
//               <i className="bi bi-exclamation-octagon"></i> We will send you an
//               OTP to verify your email
//             </div>
//           )}
//           <BLOCKBUTTON
//             onClick={() => {
//               if (Validate.email(email)) {
//                 setStep(2);
//               }
//             }}
//             className={Validate.email(email) ? "primary" : "inactive-primary"}
//           >
//             Continue
//           </BLOCKBUTTON>
//         </form>
//       </div>
//       <ToastContainer/>
//     </div>
//   );
// };

// export default Forgot;

import React, { useState } from "react";
import { BLOCKBUTTON, IMAGE, INPUT } from "../../Components/Forms";
import { Validate } from "../../Helpers/Validate";
import { PAGETITLE } from "../../Components/Typography";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Session from "../../Helpers/Session";
import { APIResponse } from "../../Helpers/General";
import { ToastContainer } from 'react-toastify';
import { FORGOT_PASSWORD } from "../../GraphQL/Mutations"; // Assuming this mutation exists
import logo from "../../assets/images/business-toolbox-icon.png";


const Forgot = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: (data) => {
      if (data.forgotPassword) {
        Session.saveAlert('Email sent successfully', 'success');
        navigate('/reset')
      }
      Session.showAlert({});
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert('#GENERIC_ERROR', 'error');
      }
      Session.showAlert({});
    }
  });

  const handleForgetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Validate.email(email)) {
       forgotPassword({ variables: { email } });
    } else {
      Session.saveAlert('#INVALID_EMAIL', 'error');
      Session.showAlert({});
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="pt-3 pb-3 col-12 col-lg-6 d-flex d-lg-block justify-content-center border-bottom">
          <Link to="/" className="navbar-brand">
            <img
              src={logo}
              alt="Business Toolbox"
              className="mr-5 px-5 py-3 img-fluid"
            />
          </Link>

        </div>
      </div>

      <div className="container">
        <div className="w3-animate-left d-flex flex-column justify-items-center h-75 align-items-center">
          <form onSubmit={handleForgetPassword} className="mt-5 pt-5">
            <PAGETITLE className="text-center fs-3 fw-bold">
              Forgot Password
            </PAGETITLE>
            <p className="text-center">
              Enter your email address to get the password reset link
            </p>
            <label className="fw-bold">Enter Your Email address</label>
            <INPUT
              type="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Enter email address"
            />
            {
              email.includes("@") && !Validate.email(email) ? (
                <div className="text-error text-small mt-3 mb-4">
                  <i className="bi bi-exclamation-triangle-fill"></i> Incorrect
                  email address
                </div>
              ) : null
              // <div className="text-muted text-small mt-3 mb-4">
              //   <i className="bi bi-exclamation-octagon"></i> We will send you
              //   an OTP to verify your email
              // </div>
            }
            <BLOCKBUTTON
              type="submit"
              className={
                Validate.email(email) ? "primary mt-4" : "inactive-primary mt-4"
              }
              disabled={!Validate.email(email) || loading}>
              {loading ? "Sending..." : "Submit"}
            </BLOCKBUTTON>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Forgot;