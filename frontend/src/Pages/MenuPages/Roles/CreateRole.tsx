import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ROLE } from "../../../GraphQL/Mutations";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { Validate } from "../../../Helpers/Validate";
import { useNavigate } from "react-router-dom";

const CreateRole = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate()
  // const [json, setJson] = useState({});
  const [createRoles] = useMutation(CREATE_ROLE, {
    onCompleted: (data) => {
      if (data.createRole) {
        Session.saveAlert("Role created successfully.", "success");
        navigate("/")
        Session.showAlert({});
      } else {
        Session.saveAlert("Failed to create role.", "error");
      }
    },
    onError: (error) => {
      // APIResponse(error);
      console.log(error)
      if (Session.countAlert() < 1) {
        Session.saveAlert(
          "NO ACCESS.",
          "error"
        );
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });
    // const resizedLogo = await resizeImage(companyData.logo, 500, 500);
 

  const handleRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!Validate.string(name)) {
      Session.saveAlert("Invalid Role.", "error");
    };


    // if (!Validate.array(json)) {
    //   Session.saveAlert("JSON permissions are required", "error");
    // }


    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }

    const variables = {
      name,
    };
    createRoles({ variables: variables });
  };
 

  return (
    <div className="container">
      <ToastContainer />
      <PAGETITLE>Create Role</PAGETITLE>
      <form>
        <label>Name of Role</label>
        <INPUT
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          //   setName(e.target.value)
          // }
          placeholder="Enter Role Name"
        />
        {/* <label>Permissions :(json)</label>
        <TEXTAREA
          name="json"
          value={JSON.stringify(json)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setJson(e.target.value)
          }
          placeholder="Enter JSON permissions"
        /> */}
        <div>
          <BLOCKBUTTON onClick={handleRole}>Create Role</BLOCKBUTTON>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;

// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// // import { Validate } from './Validate';
// // import Session from './Session';
// // import { CREATE_ROLE } from './mutations';
// import { APIResponse, getUser } from './utils';
// import { PAGETITLE, INPUT, TEXTAREA, BUTTON, BLOCKBUTTON } from './FormComponents';
// import { Validate } from '../../../Helpers/Validate';
// import Session from '../../../Helpers/Session';
// import { CREATE_ROLE } from '../../../GraphQL/Mutations';

// const CreateRoleForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     json: '',
//   });
//   const [errors, setErrors] = useState({});

//   const [createRole, { loading }] = useMutation(CREATE_ROLE);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     let formErrors = {};
//     if (!Validate.string(formData.name)) {
//       formErrors.name = 'Role name is required';
//     }
//     if (!Validate.string(formData.json)) {
//       formErrors.json = 'JSON permissions are required';
//     } else {
//       try {
//         JSON.parse(formData.json);
//       } catch (e) {
//         formErrors.json = 'Invalid JSON format';
//       }
//     }
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const user = getUser();
//     const companyId = user.company_id;

//     try {
//       const response = await createRole({
//         variables: {
//           companyId,
//           name: formData.name,
//           json: JSON.parse(formData.json)
//         }
//       });

//       if (response.data.createRole) {
//         Session.saveAlert('Role created successfully', 'success');
//         setFormData({ name: '', json: '' });
//       }
//     } catch (error) {
//       APIResponse(error);
//     }
//   };

//   return (
//     <div className="container">
//       <PAGETITLE>Create New Role</PAGETITLE>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="name" className="form-label">Role Name:</label>
//           <INPUT
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter role name"
//           />
//           {errors.name && <p className="text-danger">{errors.name}</p>}
//         </div>

//         <div className="mb-3">
//           <label htmlFor="json" className="form-label">Permissions (JSON):</label>
//           <TEXTAREA
//             id="json"
//             name="json"
//             value={formData.json}
//             onChange={handleChange}
//             placeholder="Enter JSON permissions"
//           />
//           {errors.json && <p className="text-danger">{errors.json}</p>}
//         </div>

//         <BLOCKBUTTON type="submit" disabled={loading}>
//           {loading ? 'Creating...' : 'Create Role'}
//         </BLOCKBUTTON>
//       </form>
//     </div>
//   );
// };

// export default CreateRoleForm;
