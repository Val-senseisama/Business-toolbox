import React from 'react'
import { PAGETITLE } from '../../Components/Typography'
import { BLOCKBUTTON, INPUT } from '../../Components/Forms'
import Session from '../../Helpers/Session'
import { Validate } from '../../Helpers/Validate'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'


const Reset = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [token, setToken] = React.useState("");
    const [step, setStep] = React.useState(1);

    const navigate = useNavigate();


    // const [ResetPassword, {loading}] = useMutation(RESET_PASSWORD,{
    //     onCompleted: (data) => {
    //         if (data.resetPassword) {
    //             Session.saveAlert('Password reset successfully', 'success');
    //             navigate('/login'); 
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
    // const handleSubmit = (event:Event):void => {
    //     event.preventDefault();
    //     if (!Validate.email(email)) {
    //         Session.saveAlert('#INVALID_EMAIL', 'error');
    //     };
    //     if (!Validate.string(password)) {
    //         Session.saveAlert('#INVALID_PASSWORD', 'error');
    //     }
    //     if (!Validate.string(token)) {
    //         Session.saveAlert('#INVALID_TOKEN', 'error');
    //     }
    //     // Reset password request
    //     ResetPassword({ variables: { email, password, token } });

    // };
    return (
        <div className='container'>
             <div className='w3-animate-left'>
            <div className='d-flex flex-wrap align-content-center'>
                <Link className='dark me-5 fs-3 mt-3' to="/forgot"><i className="bi bi-arrow-left"></i></Link>
            </div>
            <PAGETITLE>Reset Password</PAGETITLE>
            <div className='text-start'>Type the reset code that was sent to your email along with your new password.</div>
            <form>
                <label>Email</label>
                <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
                <label>New Password</label>
                <INPUT type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Enter new password" />
                <label>Token</label>
                <INPUT type="text" value={token} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)} placeholder="Enter token  " />
                <BLOCKBUTTON onClick={() => {
                    if (Validate.email(email)) {
                        setStep(2)
                    }
                }} className={Validate.email(email) ? 'primary' : 'inactive-primary'}>Reset Password</BLOCKBUTTON>
            </form>
             </div>

        </div >
    )
}

export default Reset
