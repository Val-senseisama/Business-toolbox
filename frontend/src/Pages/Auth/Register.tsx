import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../Components/Forms'
import { Validate } from '../../Helpers/Validate';
import { PAGETITLE } from '../../Components/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Session from '../../Helpers/Session';
import { ToastContainer } from 'react-toastify';
import { APIResponse } from '../../Helpers/General';

const Register = () => {

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("");
    const [phonenumber, setPhoneNumber] = useState("")

    const navigate = useNavigate()

    // const [register, { loading }] = useMutation(REGISTER, {
    //     onCompleted: () => {
    //         navigate('/login');
    //         Session.saveAlert('#REGISTER_SUCCESS', 'success');
    //     },
    //     onError: error => {
    //         APIResponse(error);
    //         if (Session.countAlert() < 1) {
    //             Session.saveAlert('#GENERIC_ERROR', 'error');
    //         }
    //         // Session.showAlert();
    //     }
    // });

    const handleRegister = (event:any) =>{
        event.preventDefault();
        if (!Validate.string(firstname)) {
            Session.saveAlert("First name is required")
        }
        if (!Validate.string(lastname)) {
            Session.saveAlert("Last name is required")

        }
        if (!Validate.string(title)) {
            Session.saveAlert("Title is required")

        }
        if (!Validate.email(email)) {
            alert('Invalid email')
        }
        if (!Validate.string(password)) {
            Session.saveAlert("Password is required")

            
        }
        if (!Validate.formatPhone(phonenumber)) {
            Session.saveAlert("Invalid phone number")

        }
        // register({ variables: { email, password, title, firstname, lastname, phonenumber } })
    }



    return (
        <div className='container'>
             <div className='w3-animate-left'>
             <PAGETITLE>REGISTER</PAGETITLE>
            <form onSubmit={handleRegister}>
                <label>Title</label>
                <INPUT type="text" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="Enter Title" />
                <label>First Name</label>
                <INPUT type="text" value={firstname} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} placeholder="Enter your First Name" />
                <label>Last Name</label>
                <INPUT type="text" value={lastname} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} placeholder="Enter your Last Name" />
                <label>Email</label>
                <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
                <label>Password</label>
                <INPUT type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Enter your password" />
                <label>Phone Number</label>
                <INPUT type="text" value={phonenumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)} placeholder="Enter your Phone Number (e.g +234)" />
                <BLOCKBUTTON 
                 className={Validate.email(email) ? 'primary' : 'inactive-primary'}>Sign Up</BLOCKBUTTON>
                <div className='text-center mt-3'><span className='text-muted'>Already have an account?</span> <Link className='text-primary' to="/login">Login</Link></div>

            </form>
             </div>
          <ToastContainer/>

        </div >
    )
}

export default Register
