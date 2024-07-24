import React, {useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { PAGETITLE } from '../../Components/Typography';
import { BLOCKBUTTON, BUTTON, INPUT } from '../../Components/Forms';
import { Validate } from '../../Helpers/Validate';
import Session from '../../Helpers/Session';
import OTPInput from 'react-otp-input';
import { useMutation } from '@apollo/client';
const Activate = () => {
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [token, setToken] = useState("");

    const navigate = useNavigate();

    // const [activate, {loading, data}] = useMutation(ACTIVATE,{
    //     onCompleted: () =>{
    //         if(data?.activate){
    //             Session.saveAlert('Account activated successfully', 'success');
    //             navigate('/login');
    //         }
    //     }
    // });

    // const handleActivate = (event: any)=>{
    //     event.preventDefault();
    //     if(otp.length === 4){
    //         activate({variables: {token, email}})
    //     }
    //     else{
    //         Session.saveAlert('#INVALID_OTP', 'error');
    //     };

    // };


    return (
        <div className='container'>
                <div className={'w3-animate-right '}>
                    <div className='d-flex flex-wrap align-content-center'>
                        <Link className='dark me-5 fs-3 mt-3' onClick={() => setStep(1)} to="#"><i className="bi bi-arrow-left"></i></Link>
                    </div>
                    <PAGETITLE>Enter Verification Code</PAGETITLE>
                    <label className='mb-5'>Kindly enter the verification code sent to <div className='fs-6 mt-1 fw-bolder'>{email}</div></label>
                    <form>
                        <label>Email</label>
                    <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
                    <label>Verification Code</label>
                    <INPUT type="text" value={token} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)} placeholder="Enter your verification code" />

                    <BLOCKBUTTON onClick={() => {
                        if (otp.length === 4) {
                            // do your stuff
                            Session.showAlert({ str: 'Do something here', type: 'default' });
                        }
                    }} className={otp.length === 4 ? 'primary mt-5' : 'inactive-primary mt-5'}>Verify</BLOCKBUTTON>

                    <div className='text-center mt-3'><span className='text-muted'>Didn’t receive any code?</span> 
                    <BUTTON className='transparent text-primary p-0' onClick={() => Session.showAlert({ str: 'Do something here', type: 'warning' })}>Resend OTP</BUTTON>
                    </div>
                    </form>



                 
                </div>
        </div >
    )
}

export default Activate
