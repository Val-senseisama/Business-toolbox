import React from 'react'
import { PAGETITLE } from '../../Components/Typography'
import { BLOCKBUTTON, INPUT } from '../../Components/Forms'
import Session from '../../Helpers/Session'
import { Validate } from '../../Helpers/Validate'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RESET_PASSWORD } from '../../GraphQL/Mutations'
import { APIResponse } from '../../Helpers/General'


const Reset = () => {
    const [resetData, setResetData] = React.useState({
        email:"",
        password:"",
        token:""
    })
  

    const navigate = useNavigate(); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResetData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        Session.remove("alerts");
      };

    const [resetPassword, {loading}] = useMutation(RESET_PASSWORD,{
      onCompleted: (data) => {
           if (data.resetPassword) {
                Session.saveAlert('Password reset successfully' ,'success');         
              navigate('/login');
           }
           Session.showAlert({});
        },
      onError: (error) => {
            APIResponse(error);
            if (Session.countAlert() < 1) {
                Session.saveAlert('#GENERIC_ERROR', 'error');
            }else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                APIResponse(error);
                if (Session.countAlert() < 1) {
                    Session.saveAlert('An error occurred. Please try again.', 'error');
                }
            }else{
                Session.removeAll();
            }
        
              Session.showAlert({});
        }
    });
   
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let hasErrors = true;

        if (!Validate.email(resetData.email)) {
            Session.saveAlert('Please enter a valid email address.', 'error');
            hasErrors = false;
        }
        if (!Validate.string(resetData.password)) {
            Session.saveAlert('Please enter your password.', 'error');
          hasErrors = false;
        }
        if (!Validate.string(resetData.token)) {
            Session.saveAlert('Please enter token.', 'error');
            hasErrors = false;
        }
        if (!hasErrors) {
            Session.showAlert({});
      }
      try {
      resetPassword({variables: { ...resetData }});
      } catch (error) {
        console.log(error);
        
      }
      
        return hasErrors;
    //  Login({ variables: { ...loginData } });

    }
  
  
    return (
        <div className='container'>
             <div className='w3-animate-left'>
            <div className='d-flex flex-wrap align-content-center'>
                <Link className='dark me-5 fs-3 mt-3' to="/forgot"><i className="bi bi-arrow-left"></i></Link>
            </div>
            <PAGETITLE>Reset Password</PAGETITLE>
            <div className='text-start'>Type the reset code that was sent to your email along with your new password.</div>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <INPUT 
                type="email"
                name="email"
                value={resetData.email} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange({
                      ...e,
                      target: { ...e.target, name: "email" },
                    })
                  }
                placeholder="Enter email address" />
                <label>New Password</label>
                <INPUT 
                type="password"
                 value={resetData.password}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange({
                      ...e,
                      target: { ...e.target, name: "password" },
                    })
                  }
                   placeholder="Enter new password" />
                <label>Token</label>
                <INPUT 
                type="text" 
                value={resetData.token} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange({
                      ...e,
                      target: { ...e.target, name: "token" },
                    })
                  }
                 placeholder="Enter token  " />
            <BLOCKBUTTON type="submit" className={Validate.email(resetData.email) ? 'primary' : 'inactive-primary'}
            disabled={loading}
            >Reset Password</BLOCKBUTTON>
            </form>
             </div>
      <ToastContainer />


        </div >
    )
}

export default Reset