// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { CREATE_EMPLOYEE } from '../../../GraphQL/Mutations';
// import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
// import { PAGETITLE } from '../../../Components/Typography';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Session from '../../../Helpers/Session';
// import { APIResponse } from '../../../Helpers/General';
// import { Validate } from '../../../Helpers/Validate';

// const CreateEmployee: React.FC = () => {
//   const [formData, setFormData] = useState({
//     companyId: '',
//     branchId: '',
//     details: {
//       name: '',
//       position: '',
//       email: '',
//       phone: ''
//     }
//   });

//   const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
//     onCompleted: () => {
//       Session.saveAlert("Employee created successfully.", "success");
//       Session.showAlert({});
//       setFormData({
//         companyId: '',
//         branchId: '',
//         details: {
//           name: '',
//           position: '',
//           email: '',
//           phone: ''
//         }
//       });
//     },
//     onError: (error) => {
//       APIResponse(error);
//       if (Session.countAlert() < 1) {
//         Session.saveAlert("Error creating employee. Please try again.", "error");
//       }
//       Session.showAlert({});
//       Session.removeAll();
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       details: {
//         ...prevData.details,
//         [name]: value
//       }
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     if (!Validate.integer(formData.companyId) || !Validate.integer(formData.branchId)) {
//       Session.saveAlert("Invalid Company ID or Branch ID.", "error");
//       Session.showAlert({});
//       return;
//     }
    
//     if (!Validate.string(formData.details.name) || !Validate.string(formData.details.position) ||
//         !Validate.email(formData.details.email) || !Validate.phone(formData.details.phone)) {
//       Session.saveAlert("Invalid employee details.", "error");
//       Session.showAlert({});
//       return;
//     }
    
//     createEmployee({
//       variables: {
//         companyId: parseInt(formData.companyId),
//         branchId: parseInt(formData.branchId),
//         details: formData.details
//       }
//     });
//   };

//   return (
//     <div className="container">
//       <PAGETITLE>Create Employee</PAGETITLE>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Company ID</label>
//           <INPUT
//             type="text"
//             name="companyId"
//             value={formData.companyId}
//             onChange={handleChange}
//             placeholder="Enter company ID"
//           />
//         </div>
//         <div>
//           <label>Branch ID</label>
//           <INPUT
//             type="text"
//             name="branchId"
//             value={formData.branchId}
//             onChange={handleChange}
//             placeholder="Enter branch ID"
//           />
//         </div>
//         <div>
//           <label>Name</label>
//           <INPUT
//             type="text"
//             name="name"
//             value={formData.details.name}
//             onChange={handleDetailsChange}
//             placeholder="Enter employee name"
//           />
//         </div>
//         <div>
//           <label>Position</label>
//           <INPUT
//             type="text"
//             name="position"
//             value={formData.details.position}
//             onChange={handleDetailsChange}
//             placeholder="Enter position"
//           />
//         </div>
//         <div>
//           <label>Email</label>
//           <INPUT
//             type="email"
//             name="email"
//             value={formData.details.email}
//             onChange={handleDetailsChange}
//             placeholder="Enter email"
//           />
//         </div>
//         <div>
//           <label>Phone</label>
//           <INPUT
//             type="text"
//             name="phone"
//             value={formData.details.phone}
//             onChange={handleDetailsChange}
//             placeholder="Enter phone number"
//           />
//         </div>
//         <div>
//           <BLOCKBUTTON type="submit">Create Employee</BLOCKBUTTON>
//         </div>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default CreateEmployee;

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_EMPLOYEE } from '../../../../GraphQL/Mutations';
import { BLOCKBUTTON, INPUT } from '../../../../Components/Forms';
import { PAGETITLE } from '../../../../Components/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Session from '../../../../Helpers/Session';
import { APIResponse } from '../../../../Helpers/General';
import { Validate } from '../../../../Helpers/Validate';

const CreateEmployee: React.FC = () => {
  const [formData, setFormData] = useState({
    companyId: '',
    branchId: '',
    details: {
      employee_id: '',
      job_title_id: '',
      department_id: '',
      salary_id: '',
      manager_id: '',
      firstname: '',
      middlename: '',
      lastname: '',
      photo_url: '',
      gender: '',
      nationality: '',
      email: '',
      phone: '',
      bank_name: '',
      bank_account_name: '',
      bank_account_number: '',
      gross_salary: '',
      loan_repayment: '',
      penalties: '',
      union_dues: '',
      health: '',
      retirements: '',
      other_deductions: '',
      income_tax: '',
      date_of_hire: '',
      address: '',
      city: '',
      state: '',
      country: '',
      next_of_kin_name: '',
      next_of_kin_phone: '',
      next_of_kin_address: '',
      next_of_kin_relationship: '',
      next_of_kin_email: '',
      next_of_kin_gender: '',
      next_of_kin_occupation: '',
      date_of_birth: '',
      emergency_contact: '',
      employment_type: '',
      leave_balance: ''
    }
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      Session.saveAlert("Employee created successfully.", "success");
      Session.showAlert({});
      setFormData({
        companyId: '',
        branchId: '',
        details: {
          employee_id: '',
          job_title_id: '',
          department_id: '',
          salary_id: '',
          manager_id: '',
          firstname: '',
          middlename: '',
          lastname: '',
          photo_url: '',
          gender: '',
          nationality: '',
          email: '',
          phone: '',
          bank_name: '',
          bank_account_name: '',
          bank_account_number: '',
          gross_salary: '',
          loan_repayment: '',
          penalties: '',
          union_dues: '',
          health: '',
          retirements: '',
          other_deductions: '',
          income_tax: '',
          date_of_hire: '',
          address: '',
          city: '',
          state: '',
          country: '',
          next_of_kin_name: '',
          next_of_kin_phone: '',
          next_of_kin_address: '',
          next_of_kin_relationship: '',
          next_of_kin_email: '',
          next_of_kin_gender: '',
          next_of_kin_occupation: '',
          date_of_birth: '',
          emergency_contact: '',
          employment_type: '',
          leave_balance: ''
        }
      });
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error creating employee. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      details: {
        ...prevData.details,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!Validate.integer(formData.companyId) || !Validate.integer(formData.branchId)) {
      Session.saveAlert("Invalid Company ID or Branch ID.", "error");
      Session.showAlert({});
      return;
    }
    
    if (!Validate.string(formData.details.firstname) || !Validate.string(formData.details.lastname) ||
        !Validate.email(formData.details.email) || !Validate.phone(formData.details.phone)) {
      Session.saveAlert("Invalid employee details.", "error");
      Session.showAlert({});
      return;
    }
    
    createEmployee({
      variables: {
        companyId: parseInt(formData.companyId),
        branchId: parseInt(formData.branchId),
        details: {
          ...formData.details,
          gross_salary: parseFloat(formData.details.gross_salary || '0'),
          loan_repayment: parseFloat(formData.details.loan_repayment || '0'),
          penalties: parseFloat(formData.details.penalties || '0'),
          union_dues: parseFloat(formData.details.union_dues || '0'),
          health: parseFloat(formData.details.health || '0'),
          retirements: parseFloat(formData.details.retirements || '0'),
          other_deductions: parseFloat(formData.details.other_deductions || '0'),
          income_tax: parseFloat(formData.details.income_tax || '0')
        }
      }
    });
  };

  return (
    <div className="container">
      <PAGETITLE>Create Employee</PAGETITLE>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company ID</label>
          <INPUT
            type="text"
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            placeholder="Enter company ID"
          />
        </div>
        <div>
          <label>Branch ID</label>
          <INPUT
            type="text"
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            placeholder="Enter branch ID"
          />
        </div>
        {/* Employee Details */}
        <div>
          <label>Employee ID</label>
          <INPUT
            type="text"
            name="employee_id"
            value={formData.details.employee_id}
            onChange={handleDetailsChange}
            placeholder="Enter employee ID"
          />
        </div>
        <div>
          <label>First Name</label>
          <INPUT
            type="text"
            name="firstname"
            value={formData.details.firstname}
            onChange={handleDetailsChange}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label>Last Name</label>
          <INPUT
            type="text"
            name="lastname"
            value={formData.details.lastname}
            onChange={handleDetailsChange}
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label>Email</label>
          <INPUT
            type="email"
            name="email"
            value={formData.details.email}
            onChange={handleDetailsChange}
            placeholder="Enter email"
          />
        </div>
        <div>
          <label>Phone</label>
          <INPUT
            type="text"
            name="phone"
            value={formData.details.phone}
            onChange={handleDetailsChange}
            placeholder="Enter phone number"
          />
        </div>
   
        <div>
          <BLOCKBUTTON type="submit">Create Employee</BLOCKBUTTON>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEmployee;

