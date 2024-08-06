// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { CREATE_COMPANY_BRANCH } from '../../../GraphQL/Mutations';
// import { BLOCKBUTTON, INPUT, TEXTAREA } from '../../../Components/Forms';
// import { PAGETITLE } from '../../../Components/Typography';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Loading } from '../../../Components/Loading';
// import Session from '../../../Helpers/Session';
// import { APIResponse } from "../../../Helpers/General";
// import { Validate } from '../../../Helpers/Validate';
// import { useNavigate } from 'react-router-dom';

// interface BranchSettings {
//   address: string;
//   phone: string;
//   email: string;
// };

// const CreateCompanyBranch: React.FC = () => {
//   // const [companyId, setCompanyId] = useState<number | null>(null);
 
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [settings, setSettings] = useState<BranchSettings>({
//     address: '',
//     phone: '',
//     email: '',
//   });
//   const navigate = useNavigate();

//   const [createCompanyBranch, { loading }] = useMutation(CREATE_COMPANY_BRANCH, {
//     onCompleted: (data) => {
//       if (data.createCompanyBranch) {
//         Session.saveAlert("Company updated successfully.", "success");
//         Session.showAlert({});
//         // setBranchId(data.createCompanyBranch.id); // Save branchId after creation
//       } else {
//         Session.saveAlert("Failed to create company.", "error");
//       }
//     },
//     onError: (error) => {
//       APIResponse(error);
//       if (Session.countAlert() < 1) {
//         Session.saveAlert("Error creating company branch. Please try again.", "error");
//       }
//       Session.showAlert({});
//       Session.removeAll();
//     },
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (name in settings) {
//       setSettings((prevSettings) => ({
//         ...prevSettings,
//         [name]: value,
//       }));
//     } 
//     // else if (name === 'companyId') {
//     //   setCompanyId(parseInt(value, 10));
//     // } 
//     else if (name === 'name') {
//       setName(value);
//     } else if (name === 'description') {
//       setDescription(value);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // if (!Validate.integer(companyId)) {
//     //   Session.saveAlert('Invalid Company ID.', 'error');
//     // }
//     if (!Validate.string(name)) {
//       Session.saveAlert('Invalid Company Name.', 'error');
//     };
//     if (!Validate.string(description)) {
//       Session.saveAlert('Invalid Description.', 'error');
//     };
//     if (Session.countAlert() > 0) {
//       Session.showAlert({});
//       return;
//     }

//     const variables = {
//           // companyId,
//         name,
//         description,
//         settings: {},
//     }
//     createCompanyBranch({variables: variables})
   
//   };
 
//   return (
//     <div className="container">
//       <PAGETITLE>Create New Company Branch</PAGETITLE>
//       <form onSubmit={handleSubmit}>
//         {/* <label>Company ID</label> */}
//         {/* <INPUT
//           type="number"
//           name="companyId"
//           value={companyId || ''}
//           onChange={handleInputChange}
//           placeholder="Enter company ID"
//           required
//         /> */}
//         <label>Branch Name</label>
//         <INPUT
//           type="text"
//           name="name"
//           value={name}
//           onChange={handleInputChange}
//           placeholder="Enter branch name"
//           required
//         />
//         <label>Description</label>
//         <TEXTAREA
//           name="description"
//           value={description}
//           onChange={handleInputChange}
//           placeholder="Enter branch description"
//         />
//         {/* settings */}
//         <label>Address</label>
//         <INPUT
//           type="text"
//           name="address"
//           value={settings.address}
//           onChange={handleInputChange}
//           placeholder="Enter branch address"
//         />
//         <label>Phone</label>
//         <INPUT
//           type="tel"
//           name="phone"
//           value={settings.phone}
//           onChange={handleInputChange}
//           placeholder="Enter branch phone"
//         />
//         <label>Email</label>
//         <INPUT
//           type="email"
//           name="email"
//           value={settings.email}
//           onChange={handleInputChange}
//           placeholder="Enter branch email"
//         />
//         <BLOCKBUTTON type="submit">
//           Create Branch
//         </BLOCKBUTTON>
//       </form>
     
//       <ToastContainer />
//     </div>
//   );
// };

// export default CreateCompanyBranch;



import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CREATE_COMPANY_BRANCH } from "../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";

const CreateCompanyBranch: React.FC = () => {
  const [branchData, setBranchData] = useState({
    companyId:"",
    name: "",
    description: "",
    settings: "{}"
  });

  const [createBranch] = useMutation(CREATE_COMPANY_BRANCH, {
    onCompleted: (data) => {
      Session.saveAlert("Company branch created successfully.", "success");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({
      ...prevData,
      [name]: name === "companyId" ? parseInt(value, 10) : value,
    }));
  };

  const createCompanyBranch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Validate.integer(branchData.companyId)) {
      Session.saveAlert("Invalid company ID.", "error");
    }
    if (!Validate.string(branchData.name)) {
      Session.saveAlert("Invalid branch name.", "error");
    }
    if (!Validate.string(branchData.description)) {
      Session.saveAlert("Invalid description.", "error");
    }

    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }

    createBranch({ 
      variables: { 
        ...branchData,
        settings: JSON.parse(branchData.settings)
      } 
    });
  };

  return (
    <div className="container">
      <PAGETITLE>Create New Company Branch</PAGETITLE>
    <ToastContainer/>
      <form onSubmit={createCompanyBranch}>
        <div className="mb-3">
          <label >Company ID:</label>
          <INPUT
            type="text"
            name="companyId"
            value={branchData.companyId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBranchData({ ...branchData, companyId: e.target.value })
            }
            placeholder="Enter company ID"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Branch Name:</label>
          <INPUT
            type="text"
            id="name"
            name="name"
            value={branchData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBranchData({ ...branchData, name: e.target.value })
            }
            placeholder="Enter branch name"
          />
        </div>

        <div className="mb-3">
          <label>Description:</label>
          <TEXTAREA
            name="description"
            value={branchData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setBranchData({ ...branchData, description: e.target.value })
            }
            placeholder="Enter branch description"
          />
        </div>

        <div className="mb-3">
          {/* <label>Settings (JSON):</label> */}
          {/* <TEXTAREA
            id="settings"
            name="settings"
            value={branchData.settings}
            onChange={handleChange}
            placeholder="Enter JSON settings"
          /> */}
        </div>

        <BLOCKBUTTON type="submit">
          Create Company Branch
        </BLOCKBUTTON>
      </form>
    </div>
  );
};

export default CreateCompanyBranch;