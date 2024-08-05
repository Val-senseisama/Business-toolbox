// import React, { useState } from 'react'
// import { BLOCKBUTTON, INPUT } from '../../Components/Forms'
// import { Link, useNavigate } from 'react-router-dom'
// import { Validate } from '../../Helpers/Validate';
// import Session from '../../Helpers/Session';
// import { PAGETITLE } from '../../Components/Typography';
// import { LOGIN } from '../../GraphQL/Mutations';
// import { useMutation } from '@apollo/client';
// import { APIResponse } from '../../Helpers/General';

// const Login = () => {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const navigate = useNavigate();

//     const [Login] = useMutation(LOGIN, {
//         onCompleted: (data) => {
//             if (data.login.accessToken) {
//                 Session.setCookie('x-access-token', data.login.accessToken);
//                 Session.setCookie('x-refresh-token', data.login.refreshToken);
//                 navigate("/dashboard")
//             }
//         },
//         onError: (error) => {
//             APIResponse(error);
//             if (Session.countAlert() < 1) {
//                 Session.saveAlert('#GENERIC_ERROR', 'error');
//             }
//             else{
//                 Session.removeAll();
//             }
//             // Session.showAlert();
//         }
//     });
    

//     const handleSubmit = (event: any) => {
//         event.preventDefault();
//         if (!Validate.email(email)) {
//             Session.saveAlert('#INVALID_EMAIL', 'error');
//         };
//         if (!Validate.string(password)) {
//             Session.saveAlert('#INVALID_PASSWORD', 'error');
//         }
//         Login({ variables: { email, password } });

//     }

//     return (
//         <div className='container'>

//             <div className='w3-animate-left'>
//                 <div className='d-flex flex-wrap align-content-center'>
//                     <Link className='dark me-5 fs-3 mt-3' to="/"><i className="bi bi-arrow-left"></i></Link>
//                 </div>
//                 <PAGETITLE>Login into your account</PAGETITLE>
//                 <form onSubmit={handleSubmit}>
//                     <label>Email</label>
//                     <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
//                     <label>Password</label>
//                     <INPUT type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Enter your password" />
//                     <div className='mt-3'>
//                     <Link className='text-primary' to="/forgot">Forgot Password</Link>
//                     </div>
//                     <BLOCKBUTTON className={Validate.email(email) ? 'primary' : 'inactive-primary'}>Continue</BLOCKBUTTON>

//                     <div className='text-center mt-3'><span className='text-muted'>Don't have an account?</span> <Link className='text-primary' to="/register">Sign Up</Link></div>
//                 </form>

//             </div>
//         </div >

//     )
// }

// export default Login

import React, { useState, useEffect } from 'react'
import { BLOCKBUTTON, INPUT } from '../../Components/Forms'
import { Link, useNavigate } from 'react-router-dom'
import { Validate } from '../../Helpers/Validate';
import Session from '../../Helpers/Session';
import { PAGETITLE } from '../../Components/Typography';
import { LOGIN } from '../../GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import { APIResponse } from '../../Helpers/General';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email:"",
        password:"",
    });
    const [isLoading, setIsLoading] = useState(false)

   // const navigate = useNavigate();

    useEffect(() => {
        Session.remove('alerts');
    }, []);

    const [ Login ] = useMutation(LOGIN, {
        onCompleted: (data) => {
            setIsLoading(false);
            if (data.login.accessToken) {
                Session.setCookie('x-access-token', data.login.accessToken);
                Session.setCookie('x-refresh-token', data.login.refreshToken);
                alert("Login Successful");
                //navigate("/dashboard")
            }
        },
          onError: (error) => {
            setIsLoading(false);
            console.log(error);
            if (error.networkError) { 
                Session.saveAlert('Unable to connect to the server. Please check your internet connection and try again.', 'error');
            } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                APIResponse(error);
                if (Session.countAlert() < 1) {
                    Session.saveAlert('An error occurred. Please try again.', 'error');
                }
            } else {
                Session.saveAlert('An unexpected error occurred. Please try again.', 'error');
            }
            Session.showAlert({});
        }

          
        // onError: (error) => {
        //     setIsLoading(false);
        //     APIResponse(error);
        //     if (Session.countAlert() < 1) {
        //         Session.saveAlert('An error occurred. Please try again.', 'error');
        //     }
        //     Session.showAlert({});
        //     Session.removeAll();
        // }
      
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        Session.remove("alerts");
      };


    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let hasErrors = true;

        if (!Validate.email(loginData.email)) {
            Session.saveAlert('Please enter a valid email address.', 'error');
            console.log("invalid email");
            
            hasErrors = false;
        }
        if (!Validate.string(loginData.password)) {
            Session.saveAlert('Please enter your password.', 'error');
            console.log("invalid password");
            hasErrors = false;
        }

        if (!hasErrors) {
            Session.showAlert({}); 
        }
        // else {    
        // return hasErrors;
        // }
            
       Login({ variables: { ...loginData } });

    }

    return (
        <div className='container'>
            <div className='w3-animate-left'>
                <div className='d-flex flex-wrap align-content-center'>
                    <Link className='dark me-5 fs-3 mt-3' to="/"><i className="bi bi-arrow-left"></i></Link>
                </div>
                <PAGETITLE>Login into your account</PAGETITLE>
                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <INPUT
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "email" },
                })
              }
            placeholder="Enter email address"
          />
                  
                    <label>Password</label>
                    <INPUT 
                        type="password" 
                        name="password"
                        id="password"
                        value={loginData.password} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange({
                              ...e,
                              target: { ...e.target, name: "password" },
                            })
                          }
                        placeholder="Enter your password" 
                    />
                    <div className='mt-3'>
                        <Link className='text-primary' to="/forgot">Forgot Password</Link>
                    </div>
                    <BLOCKBUTTON 
                    type='submit'
                        className={Validate.email(loginData.email) ? 'primary' : 'inactive-primary'}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Continue'}
                    </BLOCKBUTTON>
                    <div className='text-center mt-3'>
                        <span className='text-muted'>Don't have an account?</span> 
                        <Link className='text-primary' to="/register">Sign Up</Link>
                    </div>
                </form>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default Login