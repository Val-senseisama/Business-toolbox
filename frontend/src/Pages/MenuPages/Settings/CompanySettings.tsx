// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UPDATE_COMPANY_SETTINGS } from "../../../GraphQL/Mutations";
// import { BLOCKBUTTON, INPUT } from "../../../Components/Forms";
// import { PAGETITLE } from "../../../Components/Typography";
// import Session from "../../../Helpers/Session";
// import { APIResponse } from "../../../Helpers/General";

// const UpdateCompanySettings: React.FC = () => {
//   const [companySettingsData, setCompanySettingsData] = useState({
//     companyId: null,
//     settings: {}
//   });
//   const navigate = useNavigate();

//   const [updateCompanySettings] = useMutation(UPDATE_COMPANY_SETTINGS, {
//     onCompleted: () => {
//       Session.saveAlert("Company settings updated successfully.", "success");
//       Session.showAlert({});
//       navigate("/companies"); // Redirect to the companies list or another relevant page
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
//     setCompanySettingsData((prevData) => ({
//       ...prevData,
//       settings: {
//         ...prevData.settings,
//         [name]: value,
//       },
//     }));
//   };

//   const handleCompanyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     // setCompanySettingsData((prevData) => ({
//     //   ...prevData,
//     //   companyId: Number(value),
//     // }));
//   };

//   const updateSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     if (!companySettingsData.companyId) {
//       Session.saveAlert("Invalid company ID.", "error");
//       Session.showAlert({});
//       return;
//     }
//     updateCompanySettings({ variables: { companyId: companySettingsData.companyId, settings: companySettingsData.settings } });
//   };

//   return (
//     <div className="container">
//       <PAGETITLE>Update Company Settings</PAGETITLE>
//       <form>
//         <div>
//           <label>Company ID</label>
//           <INPUT
//             type="number"
//             id="companyId"
//             name="companyId"
//             value={companySettingsData.companyId || ""}
//             onChange={handleCompanyIdChange}
//             placeholder="Enter company ID"
//           />
//         </div>
        
//         <div>
//           <label>Setting Key</label>
//           <INPUT
//             type="text"
//             id="settingKey"
//             name="settingKey"
//             value={companySettingsData.settings || ""}
//             onChange={handleChange}
//             placeholder="Enter setting key"
//           />
//         </div>
//         <div>
//           <label>Setting Value</label>
//           <INPUT
//             type="text"
//             id="settingValue"
//             name="settingValue"
//             value={companySettingsData.settings || ""}
//             onChange={handleChange}
//             placeholder="Enter setting value"
//           />
//         </div>
//         <div>
//           <BLOCKBUTTON type="submit" onClick={updateSettings}>
//             Update Settings
//           </BLOCKBUTTON>
//         </div>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default UpdateCompanySettings;


import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_COMPANY_SETTINGS } from '../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import { PAGETITLE } from '../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIResponse } from '../../../Helpers/General';
import Session from '../../../Helpers/Session';
import { Validate } from '../../../Helpers/Validate';
interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  
}

const UpdateCompanySettings: React.FC = () => {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [updateCompanySettings, { loading }] = useMutation(UPDATE_COMPANY_SETTINGS, {
    onCompleted: (data) => {
      if (data.updateCompanySettings) {
        Session.saveAlert("Company settings updated successfully.", "success");
        Session.showAlert({});
  
        } else {
          Session.saveAlert("Failed to update company settings.", "error");
        }
    },
    onError: (error) => {
        APIResponse(error);
        if (Session.countAlert() < 1) {
          Session.saveAlert("Error updating company settings. Please try again.", "error");
        }
        Session.showAlert({});
        Session.removeAll();
      },
  });

  useEffect(() => {
    setCompanyId(companyId);
    setSettings({
      name: settings.name,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Validate.integer(companyId)) {
        Session.saveAlert(' Invalid Company ID.', 'error');
    };
    if (!Validate.string(settings.name)) {
        Session.saveAlert(' Invalid Company Name.', 'error');
    };
    if (!Validate.email(settings.email)) {
        Session.saveAlert(' Invalid Company Email.', 'error');
    };
    if (!Validate.phone(settings.phone)) {
        Session.saveAlert(' Invalid Company Phone.', 'error');
    };
    if (!Validate.string(settings.address)) {
        Session.saveAlert(' Invalid Company Address.', 'error');
    };
    if (Session.countAlert() > 0) {
        Session.showAlert({});
        return;
    };

    updateCompanySettings({
      variables: {
        companyId: companyId,
        settings: settings,
      },
    });
  };

  return (
    <div className="container">
      <PAGETITLE>Update Company Settings</PAGETITLE>
      <form onSubmit={handleSubmit}>
        <label>Company Name</label>
        <INPUT
          type="text"
          name="name"
          value={settings.name}
          onChange={handleInputChange}
          placeholder="Enter company name"
        />
        <label>Email</label>
        <INPUT
          type="email"
          name="email"
          value={settings.email}
          onChange={handleInputChange}
          placeholder="Enter company email"
        />
        <label>Phone</label>
        <INPUT
          type="tel"
          name="phone"
          value={settings.phone}
          onChange={handleInputChange}
          placeholder="Enter company phone"
        />
        <label>Address</label>
        <INPUT
          type="text"
          name="address"
          value={settings.address}
          onChange={handleInputChange}
          placeholder="Enter company address"
        />
        <BLOCKBUTTON type="submit">
         Update Settings
        </BLOCKBUTTON>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateCompanySettings;