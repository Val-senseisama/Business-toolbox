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
         console.log("invalid email");
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
        <div className='container'>
                <div className={'w3-animate-right '}>
                    <div className='d-flex flex-wrap align-content-center'>
                        <Link className='dark me-5 fs-3 mt-3'  to="/login"><i className="bi bi-arrow-left"></i></Link>
                    </div>
                    <PAGETITLE>Enter Verification Code</PAGETITLE>
                    <label className='mb-5'>Kindly enter the verification code sent to <div className='fs-6 mt-1 fw-bolder'>{email}</div></label>
                    <form onSubmit={handleActivate}>
                        <label>Email</label>
                    <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
                    <label>Verification Code</label>
                    <INPUT type="text" value={token} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)} placeholder="Enter your verification code" />

                    <BLOCKBUTTON
                        disabled={loading}
                        type="submit"
                    >Verify</BLOCKBUTTON>

                    <div className='text-center mt-3'><span className='text-muted'>Didn’t receive any code?</span> 
                    <BUTTON className='transparent text-primary p-0' onClick={handleResendToken}>Resend OTP</BUTTON>
                    </div>
                    </form>



                 
                </div>
        </div >
    )
}

export default Activate