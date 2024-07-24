import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../Components/Forms';
import { Validate } from '../../Helpers/Validate';
import { PAGETITLE } from '../../Components/Typography';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Session from '../../Helpers/Session';
import { APIResponse } from '../../Helpers/General';
const Forgot = () => {
    const [email, setEmail] = useState("")
    const [step, setStep] = useState(1);

    // const [ForgetPassword, {loading,data}] = useMutation(FORGET_PASSWORD,{
    //     onCompleted: (data) => {
    //         if (data.forgotPassword) {
    //             Session.saveAlert('Email sent successfully', 'success');
    //         }
    //     },
    //     onError: (error) => {
    //         APIResponse(error);
    //         if (Session.countAlert() < 1) {
    //             Session.saveAlert('#GENERIC_ERROR', 'error');
    //         }
    //         else{
    //             Session.removeAll();
    //         }
    //         // Session.showAlert();
    //     }
    // });

    // const handleForgetPassword = (event: Event) => {
    //     event.preventDefault();
    //     if (Validate.email(email)) {
    //         // forgetPassword({ variables: { email } });
    //     }
    //     else {
    //         Session.saveAlert('#INVALID_EMAIL', 'error');
    //     };

    //     ForgetPassword({ variables: { email } });

    // }

    return (
        <div className='container'>
            <div className='w3-animate-left'>
                <div className='d-flex flex-wrap align-content-center'>
                    <Link className='dark me-5 fs-3 mt-3' to="/login"><i className="bi bi-arrow-left"></i></Link>
                </div>
                <form>
                    <PAGETITLE>FORGOT PASSWORD</PAGETITLE>
                    <label>Enter Your Email address</label>
                    <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
                    {
                        email.includes('@') && !Validate.email(email) ?
                            <div className='text-error text-small mt-3 mb-4'><i className="bi bi-exclamation-triangle-fill"></i> Incorrect email address</div> :
                            <div className='text-muted text-small mt-3 mb-4'><i className="bi bi-exclamation-octagon"></i> We will send you an OTP to verify your email</div>
                    }
                    <BLOCKBUTTON onClick={() => {
                        if (Validate.email(email)) {
                            setStep(2)
                        }
                    }} className={Validate.email(email) ? 'primary' : 'inactive-primary'}>Continue</BLOCKBUTTON>
                </form>

            </div>

        </div >
    )
}

export default Forgot
