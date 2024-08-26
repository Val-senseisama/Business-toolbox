// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UPDATE_COMPANY } from "../../../GraphQL/Mutations";
// import { BLOCKBUTTON, INPUT, IMAGE } from "../../../Components/Forms";
// import { PAGETITLE } from "../../../Components/Typography";
// import Session from "../../../Helpers/Session";
// import { APIResponse } from "../../../Helpers/General";
// import { Validate } from "../../../Helpers/Validate";
// import { resizeImage } from "../../../Helpers/FileHandling";

// const UpdateCompany: React.FC = () => {
//   const [companyData, setCompanyData] = useState({
//     id: null,
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
//     settings: {}
//   });
  
//   const [company] = useMutation(UPDATE_COMPANY, {
//     onCompleted: () => {
//       Session.saveAlert("Company updated successfully.", "success");
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

//   const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const b64 = await resizeImage(event.target.files[0]);
//     //   setCompanyData((prevData) => ({
//     //     ...prevData,
//     //     logo: b64,
//     //   }));
//     }
//   };

//   const updateCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     if (!Validate.string(companyData.about)) {
//       Session.saveAlert("Invalid about.", "error");
//     }
//     if (!Validate.string(companyData.name)) {
//       Session.saveAlert("Invalid name.", "error");
//     }
//     if (!Validate.email(companyData.email)) {
//       Session.saveAlert("Invalid email.", "error");
//     }
//     if (!Validate.string(companyData.address)) {
//       Session.saveAlert("Invalid address.", "error");
//     }
//     if (!Validate.string(companyData.city)) {
//       Session.saveAlert("Invalid city.", "error");
//     }
//     if (!Validate.string(companyData.state)) {
//       Session.saveAlert("Invalid state.", "error");
//     }
//     if (!Validate.string(companyData.country)) {
//       Session.saveAlert("Invalid country.", "error");
//     }
//     if (!Validate.URL(companyData.website)) {
//       Session.saveAlert("Invalid website.", "error");
//     }
//     if (!Validate.string(companyData.industry)) {
//       Session.saveAlert("Invalid industry.", "error");
//     }
//     if (!Validate.URL(companyData.logo)) {
//       Session.saveAlert("Invalid logo.", "error");
//     }

//     if (Session.countAlert() > 0) {
//       Session.showAlert({});
//       return;
//     }
//     company({ variables: { ...companyData, updateCompanyId: companyData.id } });
//   };

//   return (
//     <div className="container">
//       <PAGETITLE>Update Company</PAGETITLE>
//       <form>
//         <IMAGE
//           src={companyData.logo}
//           className="p-0 transparent text-dark"
//           onChange={handleImageChange}
//           alt="Company Logo"
//         >
//           Upload Photo
//         </IMAGE>
//         <div>
//           <label>Company Name</label>
//           <INPUT
//             type="text"
//             id="name"
//             name="name"
//             value={companyData.name}
//             onChange={handleChange}
//             placeholder="Enter company name"
//           />
//         </div>
//         <div>
//           <label>Email</label>
//           <INPUT
//             type="email"
//             id="email"
//             name="email"
//             value={companyData.email}
//             onChange={handleChange}
//             placeholder="Enter email."
//           />
//         </div>
//         <div>
//           <label>Description</label>
//           <INPUT
//             type="text"
//             id="about"
//             name="about"
//             value={companyData.about}
//             onChange={handleChange}
//             placeholder="What is the company all about."
//           />
//         </div>
//         <div>
//           <label>Website</label>
//           <INPUT
//             type="text"
//             id="website"
//             name="website"
//             value={companyData.website}
//             onChange={handleChange}
//             placeholder="Enter your website URL."
//           />
//         </div>
//         <div>
//           <label>Address</label>
//           <INPUT
//             type="text"
//             id="address"
//             name="address"
//             value={companyData.address}
//             onChange={handleChange}
//             placeholder="Enter address."
//           />
//         </div>
//         <div>
//           <label>City</label>
//           <INPUT
//             type="text"
//             id="city"
//             name="city"
//             value={companyData.city}
//             onChange={handleChange}
//             placeholder="Enter city."
//           />
//         </div>
//         <div>
//           <label>State</label>
//           <INPUT
//             type="text"
//             id="state"
//             name="state"
//             value={companyData.state}
//             onChange={handleChange}
//             placeholder="Enter state."
//           />
//         </div>
//         <div>
//           <label>Country</label>
//           <INPUT
//             type="text"
//             id="country"
//             name="country"
//             value={companyData.country}
//             onChange={handleChange}
//             placeholder="Enter country."
//           />
//         </div>
//         <div>
//           <label>Industry</label>
//           <INPUT
//             type="text"
//             id="industry"
//             name="industry"
//             value={companyData.industry}
//             onChange={handleChange}
//             placeholder="Enter industry."
//           />
//         </div>
//         <div>
//           <BLOCKBUTTON type="submit" onClick={updateCompany}>
//             Update Company
//           </BLOCKBUTTON>
//         </div>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default UpdateCompany;



import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_COMPANY } from "../../../GraphQL/Mutations";
import { BLOCKBUTTON, IMAGE, INPUT, TEXTAREA } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { useNavigate, useParams } from "react-router-dom";
import { GET_COMPANY } from "../../../GraphQL/Queries";

const UpdateCompany:React.FC = () => {
  const { companyId } = useParams();
 
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    name: "",
    about: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    website: "",
    email: "",
    industry: "",
    logo: "",
    settings: {},
  });

  const { data: companyData, loading: companyLoading, error: companyError } = useQuery(GET_COMPANY, {
    variables: { companyId: parseInt(companyId ?? "", 10) },
  });
  useEffect(() => {
    if (companyData && companyData.company) {
      setCompany({
        name: companyData.company.name,
        about: companyData.company.about,
        address: companyData.company.address,
        city: companyData.company.city,
        state: companyData.company.state,
        country: companyData.company.country,
        phone: companyData.company.phone,
        website: companyData.company.website,
        email: companyData.company.email,
        industry: companyData.company.industry,
        logo: companyData.company.logo,
        settings: companyData.company.settings,
      });
    }
    if (companyError) {
      APIResponse(companyError);
    }
  }, [companyData, companyError]);

  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    onCompleted: (data) => {
      if (data.updateCompany) {
        Session.saveAlert("Company updated successfully.", "success");
        Session.showAlert({});
        navigate("/companies");
      } else {
        Session.saveAlert("Failed to update company.", "error");
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error updating company. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleCompanyUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
 
    if (!Validate.string(company.name)) {
      Session.saveAlert("Company Name is required", "error");
    
    };
    if (!Validate.string(company.about)) {
      Session.saveAlert("About is required", "error");
    
    };
    if (!Validate.string(company.address)) {
      Session.saveAlert("Address is required", "error");
    
    };
    if (!Validate.string(company.city)) {
      Session.saveAlert("City is required", "error");
    
    };
    if (!Validate.string(company.state)) {
      Session.saveAlert("State is required", "error");
    
    };
    if (!Validate.string(company.country)) {
      Session.saveAlert("Country is required", "error");
    
    };
    if (!Validate.phone(company.phone)) {
      Session.saveAlert("Phone is required", "error");
    
    };
    if (!Validate.URL(company.website)) {
      Session.saveAlert("Website is required", "error");
    
    };
    if (!Validate.email(company.email)) {
      Session.saveAlert("Email is required", "error");
    
    };
 

    // if (!Validate.array(company.settings)) {
    //   Session.saveAlert("Settings are required", "error");
    
    // };
    if (!Validate.string(company.industry)) {
      Session.saveAlert("Industry is required", "error");
    
    };

    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }
    const variables = {
      ...company,
      updateCompanyId: parseInt(companyId ?? "", 10),
    };
    updateCompany({ variables:variables });
  };
  if (companyLoading) return <p>Loading...</p>;

  return (
    <div className="container">
      <ToastContainer />
      <PAGETITLE>Update Company</PAGETITLE>
      <form onSubmit={handleCompanyUpdate}>
      <IMAGE src={company.logo} className="p-0 transparent text-dark"
       onChange={(b64value: string) => { console.log(b64value) }} 
       alt="Rectangle-1.png" >Upload Photo</IMAGE>

      {/* <label>Logo</label>
        <INPUT
          type="text"
          name="logo"
          value={company.logo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, logo: e.target.value })
          }
          placeholder="Enter Logo URL"
        /> */}
        <div className="row">
          <div className="col md-6 mb-3">
          <label>Company Name</label>
        <INPUT
          type="text"
          id="name"
          name="name"
          value={company.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, name: e.target.value })
          }
          placeholder="Enter Company Name"
        />
          </div>
          <div className="col md-6 mb-3">
          <label>City</label>
        <INPUT
          type="text"
          name="city"
          value={company.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, city: e.target.value })
          }
          placeholder="Enter City"
        />
          </div>
        </div>

        <div className="row">
          <div className="col md-6 mb-3">
          <label>Address</label>
        <TEXTAREA
          name="address"
          value={company.address}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCompany({ ...company, address: e.target.value })
          }
          placeholder="Enter Address"
        />
          </div>
          <div className="col md-6 mb-3">

          <label>About</label>
        <TEXTAREA
          name="about"
          value={company.about}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCompany({ ...company, about: e.target.value })
          }
          placeholder="Enter About"
        />
          </div>
        </div>

        <div className="row">
          <div className="col md-6 mb-3">
    
          <label>State</label>
        <INPUT
          type="text"
          name="state"
          value={company.state}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, state: e.target.value })
          }
          placeholder="Enter State"
        />
          </div>
          <div className="col md-6 mb-3">
          <label>Country</label>
        <INPUT
          type="text"
          name="country"
          value={company.country}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, country: e.target.value })
          }
          placeholder="Enter Country"
        />
          </div>
        </div>
        <div className="row">
          <div className="col md-6 mb-3">
 
          <label>Phone</label>
        <INPUT
          type="text"
          name="phone"
          value={company.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, phone: e.target.value })
          }
          placeholder="Enter Phone"
        />
          </div>
          <div className="col md-6 mb-3">
          <label>Email</label>
        <INPUT
          type="text"
          name="email"
          value={company.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, email: e.target.value })
          }
          placeholder="Enter Email"
        />
          </div>
        </div>

        <div className="row">
          <div className="col md-6 mb-3">
          <label>Industry</label>
        <INPUT
          type="text"
          name="industry"
          value={company.industry}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, industry: e.target.value })
          }
          placeholder="Enter Industry"
        />
          </div>
          <div className="col md-6 mb-3">
          <label>Website</label>
        <INPUT
          type="text"
          name="website"
          value={company.website}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompany({ ...company, website: e.target.value })
          }
          placeholder="Enter Website e.g https://www.google.com"
        />
          </div>

        </div>
         
        {/* <label>Settings (JSON)</label>
        <TEXTAREA
          name="settings"
          value={JSON.stringify(company.settings)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCompany({ ...company, settings: JSON.parse(e.target.value) })
          }
          placeholder="Enter Settings JSON"
        /> */}
        <div className="mb-4">
          <BLOCKBUTTON type="submit">Update Company</BLOCKBUTTON>
        </div>
      </form>
    </div>
  );
};

export default UpdateCompany;
