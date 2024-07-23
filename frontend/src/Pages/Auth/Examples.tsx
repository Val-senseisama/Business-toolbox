import React from 'react'
import { BLOCKBUTTON, BUTTON, CHECKBOX, FILE, IMAGE, INPUT, SELECT, TEXTAREA } from '../../Components/Forms'
import { Link } from 'react-router-dom'
import { Validate } from '../../Helpers/Validate';
import OtpInput from 'react-otp-input';
import Session from '../../Helpers/Session';
import { PAGETITLE } from '../../Components/Typography';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [step, setStep] = React.useState(1);
    const [otp, setOtp] = React.useState('');
    const [checkbox, setCheckbox] = React.useState(false);

    const handleCode = (value: string) => {
        // limit to digits only
        setOtp(value.replace(/\D/g, '0'));
    }

    return (
        <div className='container'>
            {
                step === 1 &&
                <div className='w3-animate-left'>
                    <div className='d-flex flex-wrap align-content-center'>
                        <Link className='dark me-5 fs-3 mt-3' to="/"><i className="bi bi-arrow-left"></i></Link>
                    </div>
                    <PAGETITLE>Login into your account</PAGETITLE>
                    <label>Email</label>

                    <INPUT type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter email address" />
                    {
                        email.includes('@') && !Validate.email(email) ?
                            <div className='text-error text-small mt-3 mb-4'><i className="bi bi-exclamation-triangle-fill"></i> Incorrect email address</div> :
                            <div className='text-muted text-small mt-3 mb-4'><i className="bi bi-exclamation-octagon"></i> We will send you an OTP to verify your email</div>
                    }

                    <CHECKBOX value={checkbox} name="remember" onChange={(e) => {
                        setCheckbox(e.target.checked)
                        console.log(e.target.checked)
                    }}><span className='ms-2'>Checkbox Example</span></CHECKBOX>

                    <SELECT name="select" onChange={(e) => { console.log(e.target.value) }}>
                        <option value="">Select Example</option>
                        <option value="1">Select Example 1</option>
                        <option value="2">Select Example 2</option>
                    </SELECT>

                    <IMAGE src="https://mysyllabux.com/assets/img/others/about_img01.png" className="p-0 transparent text-dark" onChange={(b64value: string) => { console.log(b64value) }} alt="Rectangle-1.png" >Upload Photo Example</IMAGE>

                    <div className='mt-3' >
                        <FILE className="p-0 transparent text-dark" onChange={(b64value: string) => { console.log(b64value) }} >Upload File Example</FILE>
                    </div>

                    <BLOCKBUTTON onClick={() => {
                        if (Validate.email(email)) {
                            setStep(2)
                        }
                    }} className={Validate.email(email) ? 'primary' : 'inactive-primary'}>Continue</BLOCKBUTTON>

                    <div className='text-center mt-3'><span className='text-muted'>Don't have an account?</span> <Link className='text-primary' to="/register">Sign Up</Link></div>
                </div>
            }
            {
                step !== 1 &&
                <div className={'w3-animate-right '}>
                    <div className='d-flex flex-wrap align-content-center'>
                        <Link className='dark me-5 fs-3 mt-3' onClick={() => setStep(1)} to="#"><i className="bi bi-arrow-left"></i></Link>
                    </div>
                    <PAGETITLE>Enter Verification Code</PAGETITLE>
                    <label className='mb-5'>Kindly enter the verification code sent to <div className='fs-6 mt-1 fw-bolder'>{email}</div></label>
                    <OtpInput
                        value={otp}
                        onChange={handleCode}
                        numInputs={4}
                        renderSeparator={<span className=' flex-grow-1'>&nbsp;</span>}
                        containerStyle="d-flex flex-wrap justify-content-center"
                        inputStyle="form-control flex-grow-1 fs-2 fw-bolder text-center"
                        renderInput={(props) => <input {...props} />}
                    />


                    <BLOCKBUTTON onClick={() => {
                        if (otp.length === 4) {
                            // do your stuff
                            Session.showAlert({ str: 'Do something here', type: 'default' });
                        }
                    }} className={otp.length === 4 ? 'primary mt-5' : 'inactive-primary mt-5'}>Verify</BLOCKBUTTON>

                    <div className='text-center mt-3'><span className='text-muted'>Didn’t receive any code?</span> <BUTTON className='transparent text-primary p-0' onClick={() => Session.showAlert({ str: 'Do something here', type: 'warning' })}>Resend OTP</BUTTON></div>
                </div>
            }
        </div >

    )
}

export default Login
