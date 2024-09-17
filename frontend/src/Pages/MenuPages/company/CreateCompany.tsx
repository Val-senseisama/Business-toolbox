import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CREATE_COMPANY } from "../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, IMAGE, TEXTAREA } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { resizeImage } from "../../../Helpers/FileHandling";

const CreateCompany: React.FC = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    about: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    industry: "",
    logo: "",
    settings: '{}'

  });

   const [currentStep, setCurrentStep] = useState(1);

   // Handle the next button click
   const nextStep = () => {
     if (currentStep < 3) {
       setCurrentStep(currentStep + 1);
     } else {
       // Handle form submission here
       alert("Form Submitted!");
     }
   };

   // Handle the back button click (optional, for step navigation)

  const navigate = useNavigate();

  const [company] = useMutation(CREATE_COMPANY, {
    onCompleted: (data) => {
      Session.saveAlert("Company created successfully.", "success");
      Session.showAlert({});
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("An error occurred. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Session.remove("alerts");
  };
 
  const handleLogoChange = (base64Image: string) => {
    setCompanyData(prevState => ({
      ...prevState,
      logo: base64Image
    }));
  };


  const createCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Validate.string(companyData.about)) {
      Session.saveAlert(" Invalid about.", "error");
    }
    if (!Validate.string(companyData.name)) {
      Session.saveAlert(" Invalid name.", "error");
    }
    if (!Validate.email(companyData.email)) {
      Session.saveAlert(" Invalid email.", "error");
    }
    if (!Validate.string(companyData.address)) {
      Session.saveAlert(" Invalid address.", "error");
    }
    if (!Validate.string(companyData.city)) {
      Session.saveAlert(" Invalid city.", "error");
    }
    if (!Validate.string(companyData.state)) {
      Session.saveAlert(" Invalid state.", "error");
    }
    if (!Validate.string(companyData.country)) {
      Session.saveAlert(" Invalid country.", "error");
    }
    if (!Validate.URL(companyData.website)) {
      Session.saveAlert(" Invalid website.", "error");
    }
    if (!Validate.string(companyData.industry)) {
      Session.saveAlert(" Invalid industry.", "error");
    }
    if (!Validate.URL(companyData.logo)) {
      Session.saveAlert(" Invalid logo.", "error");
    }

    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }

    // const resizedLogo = await resizeImage(companyData.logo, 500, 500);

    company({ variables: { ...companyData,settings:JSON.parse(companyData.settings) } });
  };

  const Step1 = () => {
    return (
      <>
        <div className="mb-3">
          <label>Company Logo:</label>
          <IMAGE
            id="logo"
            onChange={handleLogoChange}
            // className="btn btn-outline-primary"
          >
            Upload Logo
          </IMAGE>
        </div>
        <div className="mb-2">
          <label htmlFor="name" className="form-label">
            Company Name:
          </label>
          <INPUT
            type="text"
            id="name"
            name="name"
            value={companyData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompanyData({ ...companyData, name: e.target.value })
            }
            placeholder="Enter company name"
          />
        </div>
        <div className="mb-2">
          <label>Phone:</label>
          <INPUT
            type="tel"
            id="phone"
            name="phone"
            value={companyData.phone}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCompanyData({ ...companyData, phone: e.target.value })
            }
            placeholder="Enter phone number"
          />
        </div>
      </>
    );
  }

  const Step2 = () => {
    return (
      <>
        <div className="mb-2">
          <label>Industry:</label>
          <INPUT
            type="text"
            id="industry"
            name="industry"
            value={companyData.industry}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompanyData({ ...companyData, industry: e.target.value })
            }
            placeholder="Enter industry"
          />
        </div>

        <div className="col mb-2">
          <label>About:</label>
          <TEXTAREA
            name="about"
            value={companyData.about}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCompanyData({ ...companyData, about: e.target.value })
            }
            placeholder="Enter company description"
          />
        </div>

        <div className="mb-2">
          <label>Website:</label>
          <INPUT
            type="url"
            id="website"
            name="website"
            value={companyData.website}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCompanyData({ ...companyData, website: e.target.value })
            }
            placeholder="Enter website URL"
          />
        </div>
      </>
    );
  }

  const Step3 = () => {
    return (
      <>
        <div className="mb-2">
          <label htmlFor="address" className="form-label">
            Address:
          </label>
          <INPUT
            type="text"
            id="address"
            name="address"
            value={companyData.address}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCompanyData({ ...companyData, address: e.target.value })
            }
            placeholder="Enter address"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="city" className="form-label">
            City:
          </label>
          <INPUT
            type="text"
            id="city"
            name="city"
            value={companyData.city}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCompanyData({ ...companyData, city: e.target.value })
            }
            placeholder="Enter city"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="state" className="form-label">
            State:
          </label>
          <INPUT
            type="text"
            id="state"
            name="state"
            value={companyData.state}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCompanyData({ ...companyData, state: e.target.value })
            }
            placeholder="Enter state"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="country" className="form-label">
            Country:
          </label>
          <INPUT
            type="text"
            id="country"
            name="country"
            value={companyData.country}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCompanyData({ ...companyData, country: e.target.value })
            }
            placeholder="Enter country"
          />
        </div>
      </>
    );
  }

 
  return (
    <div className="container">
      <div className="w3-animate-left pb-5 d-flex flex-column justify-items-center mt-5 align-items-center">
        <PAGETITLE className="text-center my-3 fs-3 fw-bold">
          CREATE NEW COMPANY
        </PAGETITLE>
        <p className="text-center">
          Create your company here, you can add other details later
        </p>
        <ToastContainer />
        <div className="d-flex justify-content-between w-50 mb-4">
          <div className="progress w-50 mx-2">
            <div
              onClick={() => setCurrentStep(1)}
              className={`step-indicator progress-bar ${
                currentStep >= 1 ? "bg-primary" : "bg-light"
              }`}
              style={{ width: "100%" }}></div>
          </div>
          <div className="progress w-50 mx-2">
            <div
              onClick={() => setCurrentStep(2)}
              className={`step-indicator progress-bar ${
                currentStep >= 2 ? "bg-primary" : "bg-light"
              }`}
              style={{ width: "100%" }}></div>
          </div>
          <div className="progress w-50 mx-2">
            <div
              onClick={() => setCurrentStep(3)}
              className={`step-indicator progress-bar ${
                currentStep === 3 ? "bg-primary" : "bg-light"
              }`}
              style={{ width: "100%" }}></div>
          </div>
        </div>

        <form
          onSubmit={createCompany}
          className="col-10 col-sm-8 col-md-6 col-lg-5">
          {currentStep === 1 && <Step1 />}

          {currentStep === 2 && <Step2 />}

          {currentStep === 3 && <Step3 />}

          {/* 
  <div className="mb-3">
    <label  >Settings (JSON):</label>
    <TEXTAREA
      id="settings"
      name="settings"
      value={companyData.settings}
      onChange={handleChange}
      placeholder="Enter JSON settings"
    />
  </div> */}
          <div className="mb-3">
            {currentStep === 3 ? (
              <BLOCKBUTTON type="submit">
                {/* {loading ? 'Creating...' : 'Create Company'} */}
                Create Company
              </BLOCKBUTTON>
            ) : (
              <BLOCKBUTTON type="button" onClick={nextStep}>
                {/* {loading ? 'Creating...' : 'Create Company'} */}
                Next
              </BLOCKBUTTON>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;


 
 
 
 

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { CREATE_COMPANY } from "../../../GraphQL/Mutations";
// import { BLOCKBUTTON, INPUT, IMAGE } from "../../../Components/Forms";
// import { PAGETITLE } from "../../../Components/Typography";
// import Session from "../../../Helpers/Session";
// import { APIResponse } from "../../../Helpers/General";
// import { Validate } from "../../../Helpers/Validate";
// import { resizeImage } from "../../../Helpers/FileHandling";

// const CreateCompany: React.FC = () => {
//   const [companyData, setCompanyData] = useState({
//     name: "",
//     about: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     phone: "",
//     email: "",
//     website: "",
//     industry: "",
//     logo: "",
//     settings: '{}'
//   });
//   const navigate = useNavigate();

//   const [company] = useMutation(CREATE_COMPANY, {
//     onCompleted: (data) => {
//       Session.saveAlert("Company created successfully.", "success");
//       Session.showAlert({});
//     },
//     onError: (error) => {
//       APIResponse(error);
//       if (Session.countAlert() < 1) {
//         Session.saveAlert("An error occurred. Please try again.", "error");
//       }
//       Session.showAlert({});
//       Session.removeAll();
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCompanyData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   //   if (event.target.files && event.target.files.length > 0) {
//   //     const b64 = await resizeImage(event.target.files[0]);
//   //     // setCompanyData((prevData) => ({
//   //     //   ...prevData,
//   //     //   logo: b64,
//   //     // }));
//   //   }
//   // };

//   const handleLogoChange = (base64Image: string) => {
//     setCompanyData(prevState => ({
//       ...prevState,
//       logo: base64Image
//     }));
//   };


//   const createCompany = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!Validate.string(companyData.about)) {
//       toast.error(" Invalid about.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.string(companyData.name)) {
//       toast.error(" Invalid name.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.email(companyData.email)) {
//       toast.error(" Invalid email.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.string(companyData.address)) {
//       toast.error(" Invalid address.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.string(companyData.city)) {
//       toast.error(" Invalid city.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.string(companyData.state)) {
//       toast.error(" Invalid state.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.string(companyData.country)) {
//       toast.error(" Invalid country.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.URL(companyData.website)) {
//       toast.error(" Invalid website.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.string(companyData.industry)) {
//       toast.error(" Invalid industry.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     if (!Validate.URL(companyData.logo)) {
//       toast.error(" Invalid logo.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }

//     if (Session.countAlert() > 0) {
//       toast.success("Company created successfully.", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }

// // settings: JSON.parse(formData.settings)

//     company({ variables: { ...companyData,settings:JSON.parse(companyData.settings) } });
//   };


//   return (
//     <div className="container">
//       <PAGETITLE>Create New Company</PAGETITLE>

//       <form onSubmit={createCompany}>
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label htmlFor="name" className="form-label">Company Name:</label>
//             <INPUT
//               type="text"
//               id="name"
//               name="name"
//               value={companyData.name}
//               onChange={handleChange}
//               placeholder="Enter company name"
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label htmlFor="industry" className="form-label">Industry:</label>
//             <INPUT
//               type="text"
//               id="industry"
//               name="industry"
//               value={companyData.industry}
//               onChange={handleChange}
//               placeholder="Enter industry"
//             />
//           </div>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="about" className="form-label">About:</label>
//           <TEXTAREA
//             id="about"
//             name="about"
//             value={companyData.about}
//             onChange={handleChange}
//             placeholder="Enter company description"
//           />
//         </div>

//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label htmlFor="address" className="form-label">Address:</label>
//             <INPUT
//               type="text"
//               id="address"
//               name="address"
//               value={companyData.address}
//               onChange={handleChange}
//               placeholder="Enter address"
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label htmlFor="city" className="form-label">City:</label>
//             <INPUT
//               type="text"
//               id="city"
//               name="city"
//               value={companyData.city}
//               onChange={handleChange}
//               placeholder="Enter city"
//             />
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-md-4 mb-3">
//             <label htmlFor="state" className="form-label">State:</label>
//             <INPUT
//               type="text"
//               id="state"
//               name="state"
//               value={companyData.state}
//               onChange={handleChange}
//               placeholder="Enter state"
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label htmlFor="country" className="form-label">Country:</label>
//             <INPUT
//               type="text"
//               id="country"
//               name="country"
//               value={companyData.country}
//               onChange={handleChange}
//               placeholder="Enter country"
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label htmlFor="phone" className="form-label">Phone:</label>
//             <INPUT
//               type="tel"
//               id="phone"
//               name="phone"
//               value={companyData.phone}
//               onChange={handleChange}
//               placeholder="Enter phone number"
//             />
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label htmlFor="email" className="form-label">Email:</label>
//             <INPUT
//               type="email"
//               id="email"
//               name="email"
//               value={companyData.email}
//               onChange={handleChange}
//               placeholder="Enter email"
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label htmlFor="website" className="form-label">Website:</label>
//             <INPUT
//               type="url"
//               id="website"
//               name="website"
//               value={companyData.website}
//               onChange={handleChange}
//               placeholder="Enter website URL"
//             />
//           </div>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="logo" className="form-label">Company Logo:</label>
//           <IMAGE
//             id="logo"
//             onChange={handleLogoChange}
//             className="btn btn-outline-primary"
//           >
//             Upload Logo
//           </IMAGE>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="settings" className="form-label">Settings (JSON):</label>
//           <TEXTAREA
//             id="settings"
//             name="settings"
//             value={companyData.settings}
//             onChange={handleChange}
//             placeholder="Enter JSON settings"
//           />
//         </div>

//         <BUTTON type="submit" disabled={loading} className="btn-primary">
//           {/* {loading ? 'Creating...' : 'Create Company'} */}
//           Create Company
//         </BUTTON>
//       </form>
//     </div>
//   );
// };

// export default CreateCompany;
// ```
