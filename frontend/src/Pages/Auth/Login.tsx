import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../Components/Forms'
import { Link, useNavigate } from 'react-router-dom'
import { Validate } from '../../Helpers/Validate';
import Session from '../../Helpers/Session';
import { PAGETITLE } from '../../Components/Typography';
import { LOGIN } from '../../GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import { APIResponse } from '../../Helpers/General';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const [Login] = useMutation(LOGIN, {
        onCompleted: (data) => {
            if (data.login.accessToken) {
                Session.setCookie('x-access-token', data.login.accessToken);
                Session.setCookie('x-refresh-token', data.login.refreshToken);
                navigate("/dashboard")
            }
        },
        onError: (error) => {
            APIResponse(error);
            if (Session.countAlert() < 1) {
                Session.saveAlert('#GENERIC_ERROR', 'error');
            }
            else{
                Session.removeAll();
            }
            // Session.showAlert();
        }
    });
    

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (!Validate.email(email)) {
            Session.saveAlert('#INVALID_EMAIL', 'error');
        };
        if (!Validate.string(password)) {
            Session.saveAlert('#INVALID_PASSWORD', 'error');
        }
        Login({ variables: { email, password } });

    }

    return (
        <div className='container'>

            <div className='w3-animate-left'>
                <div className='d-flex flex-wrap align-content-center'>
                    <Link className='dark me-5 fs-3 mt-3' to="/"><i className="bi bi-arrow-left"></i></Link>
                </div>
                <PAGETITLE>Login into your account</PAGETITLE>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
                    <label>Password</label>
                    <INPUT type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Enter your password" />
                    <div className='mt-3'>
                    <Link className='text-primary' to="/forgot">Forgot Password</Link>
                    </div>
                    <BLOCKBUTTON onClick={() => {  }} className={Validate.email(email) ? 'primary' : 'inactive-primary'}>Continue</BLOCKBUTTON>

                    <div className='text-center mt-3'><span className='text-muted'>Don't have an account?</span> <Link className='text-primary' to="/register">Sign Up</Link></div>
                </form>

            </div>
        </div >

    )
}

export default Login
