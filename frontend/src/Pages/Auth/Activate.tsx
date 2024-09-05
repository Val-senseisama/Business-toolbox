import React, {useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { PAGETITLE } from '../../Components/Typography';
import { BLOCKBUTTON, BUTTON, INPUT } from '../../Components/Forms';
import { Validate } from '../../Helpers/Validate';
import Session from '../../Helpers/Session';
//import OTPInput from 'react-otp-input';
import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL } from '../../GraphQL/Mutations';
import { APIResponse } from '../../Helpers/General';
import logo from "../../assets/images/business-toolbox-icon.png";
const Activate = () => {
    const [email, setEmail] = useState("")
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const [activate, {loading, data}] = useMutation(VERIFY_EMAIL,{
        onCompleted: () =>{
            if(data?.activate){
                Session.saveAlert('Account activated successfully', 'success');
                navigate('/login');
            }
        },
        onError: (error) => {
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {

                 APIResponse(error);
                if (Session.countAlert() < 1) {
                    Session.saveAlert('An error occurred. Please try again.', 'error');
                }
            } else {
                Session.saveAlert('An unexpected error occurred. Please try again.', 'error');
            }
            Session.showAlert({});
            }
        }
    );

    const handleActivate = (event: any)=>{
        event.preventDefault();
        let hasErrors = true;
     if (!Validate.email(email)) {
            Session.saveAlert('Please enter a valid email address.', 'error');
         hasErrors = false
     }
         if (!hasErrors) {
            Session.showAlert({}); 
        }
        
        if (token.length !== 4) {
            console.log("valid token");
            
            activate({variables: {token, email}})
        }
        else{
            Session.saveAlert('#INVALID_OTP', 'error');
             Session.showAlert({});
        };

    };

  
    const handleResendToken = async (event:any) => {
        event.preventDefault();
        // try {
        //   await sendLoginToken({ variables: { token} });
        //  Session.showAlert({ str: 'Message sent. Please check your email to rettrieve your token.', type: 'success' })
        // } catch (error) {
        //  Session.showAlert({ str: 'Failed to send login token. Please try again.', type: 'error' })}
        // }
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
          <div
            className={
              "w3-animate-right  pb-5 d-flex flex-column justify-items-center mt-5 align-items-center"
            }>
            <PAGETITLE className="text-center my-3 fs-3 fw-bold">
              Enter Verification Code
            </PAGETITLE>
            <label className="mb-5 text-center">
              Kindly enter the verification code sent to
              <div className="fs-6 mt-1 fw-bolder">{email}</div>
            </label>
            <form
              onSubmit={handleActivate}
              className="col-10 col-sm-8 col-md-6 col-lg-5">
              <label className="fw-bold fs-6">Email</label>
              <INPUT
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email address"
              />
              <label className="fw-bold fs-6">Verification Code</label>
              <INPUT
                type="text"
                value={token}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setToken(e.target.value)
                }
                placeholder="Enter your verification code"
              />

              <BLOCKBUTTON disabled={loading} type="submit">
                Verify
              </BLOCKBUTTON>

              <div className="text-center mt-3">
                <span className="text-muted">Didn’t receive any code?</span>
                <BUTTON
                  className="transparent text-primary mx-2 my-0 p-0"
                  onClick={handleResendToken}>
                  Resend OTP
                </BUTTON>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}

export default Activate