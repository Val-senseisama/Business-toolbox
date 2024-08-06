import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_EMPLOYEE } from "../../../../GraphQL/Mutations";
import { GET_ALL_EMPLOYEES } from "../../../../GraphQL/Queries";
import { BLOCKBUTTON, INPUT, TEXTAREA } from "../../../../Components/Forms";
import { PAGETITLE } from "../../../../Components/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Session from "../../../../Helpers/Session";
import { APIResponse } from "../../../../Helpers/General";
import { Validate } from "../../../../Helpers/Validate";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    companyId: 0,
    branchId: 0,
    details: {
      address: "",
      bank_account_name: "",
      bank_account_number: "",
      bank_name: "",
      city: "",
      country: "",
      date_of_birth: "",
      date_of_hire: "",
      department_id: "",
      email: "",
      emergency_contact: "",
      employee_id: "",
      employment_type: "",
      firstname: "",
      gender: "",
      gross_salary: "",
      health: "",
      income_tax: "",
      job_title_id: "",
      lastname: "",
      leave_balance: "",
      loan_repayment: "",
      manager_id: "",
      middlename: "",
      nationality: "",
      next_of_kin_address: "",
      next_of_kin_email: "",
      next_of_kin_gender: "",
      next_of_kin_name: "",
      next_of_kin_occupation: "",
      next_of_kin_phone: "",
      next_of_kin_relationship: "",
      other_deductions: "",
      penalties: "",
      phone: "",
      photo_url: "",
      retirements: "",
      salary_id: "",
      state: "",
      union_dues: ""
    }

  });

  const { data: employeeData, loading: employeeLoading, error: employeeError } = useQuery(GET_ALL_EMPLOYEES, {
    variables: { employeeId: parseInt(employeeId ?? "", 10) },
  });

  useEffect(() => {
    if (employeeData && employeeData.employee) {
      setEmployee({
        companyId: employeeData.employee.company_id,
        branchId: employeeData.employee.branch_id,
        details: employeeData.employee.details
      });
    }
    if (employeeError) {
      APIResponse(employeeError);
    }
  }, [employeeData, employeeError]);

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: (data) => {
      if (data.updateEmployee) {
        Session.saveAlert("Employee updated successfully.", "success");
        Session.showAlert({});
        navigate("/employees");
      } else {
        Session.saveAlert("Failed to update employee.", "error");
      }
    },
    onError: (error) => {
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("Error updating employee. Please try again.", "error");
      }
      Session.showAlert({});
      Session.removeAll();
    },
  });

  const handleEmployeeUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform validations
    if (!Validate.integer(employee.companyId)) {
      Session.saveAlert(`Invalid Company ID.`, "error");
    }
    if (!Validate.integer(employee.branchId)) {
      Session.saveAlert(`Invalid Branch ID.`, "error");
    }
    // Add more validations for details fields as needed

    if (Session.countAlert() > 0) {
      Session.showAlert({});
      return;
    }

    const variables = {
      updateEmployeeId: parseInt(employeeId ?? "", 10),
      companyId: employee.companyId,
      branchId: employee.branchId,
      details: employee.details
    };

    updateEmployee({ variables });
  };

  if (employeeLoading) return <p>Loading...</p>;

  return (
    <div className="container">
      <ToastContainer />
      <PAGETITLE>Update Employee</PAGETITLE>
      <form onSubmit={handleEmployeeUpdate}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Company ID</label>
            <INPUT
              type="number"
              value={employee.companyId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, companyId: parseInt(e.target.value) })}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Branch ID</label>
            <INPUT
              type="number"
              value={employee.branchId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, branchId: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>First Name</label>
            <INPUT
              type="text"
              value={employee.details.firstname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, firstname: e.target.value } })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Middle Name</label>
            <INPUT
              type="text"
              value={employee.details.middlename}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, middlename: e.target.value } })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Last Name</label>
            <INPUT
              type="text"
              value={employee.details.lastname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, lastname: e.target.value } })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <INPUT
              type="email"
              value={employee.details.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, email: e.target.value } })}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Phone</label>
            <INPUT
              type="tel"
              value={employee.details.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, phone: e.target.value } })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Date of Birth</label>
            <INPUT
              type="date"
              value={employee.details.date_of_birth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, date_of_birth: e.target.value } })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Date of Hire</label>
            <INPUT
              type="date"
              value={employee.details.date_of_hire}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, date_of_hire: e.target.value } })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Gender</label>
            <INPUT
              type="text"
              value={employee.details.gender}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, gender: e.target.value } })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <label>Address</label>
            <TEXTAREA
              value={employee.details.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmployee({ ...employee, details: { ...employee.details, address: e.target.value } })}
            />
          </div>
        </div>

        <div className="row">
    <div className="col-md-4 mb-3">
      <label>Employee ID</label>
      <INPUT
        type="text"
        value={employee.details.employee_id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, employee_id: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Department ID</label>
      <INPUT
        type="number"
        value={employee.details.department_id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, department_id: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Job Title ID</label>
      <INPUT
        type="number"
        value={employee.details.job_title_id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, job_title_id: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Employment Type</label>
      <INPUT
        type="text"
        value={employee.details.employment_type}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, employment_type: e.target.value } })}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Manager ID</label>
      <INPUT
        type="number"
        value={employee.details.manager_id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, manager_id: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-4 mb-3">
      <label>Nationality</label>
      <INPUT
        type="text"
        value={employee.details.nationality}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, nationality: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Photo URL</label>
      <INPUT
        type="url"
        value={employee.details.photo_url}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, photo_url: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Emergency Contact</label>
      <INPUT
        type="text"
        value={employee.details.emergency_contact}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, emergency_contact: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Bank Name</label>
      <INPUT
        type="text"
        value={employee.details.bank_name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, bank_name: e.target.value } })}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Bank Account Name</label>
      <INPUT
        type="text"
        value={employee.details.bank_account_name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, bank_account_name: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Bank Account Number</label>
      <INPUT
        type="text"
        value={employee.details.bank_account_number}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, bank_account_number: e.target.value } })}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Salary ID</label>
      <INPUT
        type="number"
        value={employee.details.salary_id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, salary_id: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-4 mb-3">
      <label>Gross Salary</label>
      <INPUT
        type="number"
        value={employee.details.gross_salary}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, gross_salary: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Income Tax</label>
      <INPUT
        type="number"
        value={employee.details.income_tax}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, income_tax: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Union Dues</label>
      <INPUT
        type="number"
        value={employee.details.union_dues}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, union_dues: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-4 mb-3">
      <label>Health</label>
      <INPUT
        type="number"
        value={employee.details.health}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, health: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Loan Repayment</label>
      <INPUT
        type="number"
        value={employee.details.loan_repayment}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, loan_repayment: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Other Deductions</label>
      <INPUT
        type="number"
        value={employee.details.other_deductions}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, other_deductions: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-4 mb-3">
      <label>Penalties</label>
      <INPUT
        type="number"
        value={employee.details.penalties}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, penalties: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Retirements</label>
      <INPUT
        type="number"
        value={employee.details.retirements}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, retirements: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Leave Balance</label>
      <INPUT
        type="number"
        value={employee.details.leave_balance}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, leave_balance: e.target.value } })}
      />
    </div>
  </div>

  {/* <div className="row">
    <div className="col-md-12 mb-3">
      <label>Next of Kin Information</label>
    </div>
  </div> */}

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Next of Kin Name</label>
      <INPUT
        type="text"
        value={employee.details.next_of_kin_name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, next_of_kin_name: e.target.value } })}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Next of Kin Relationship</label>
      <INPUT
        type="text"
        value={employee.details.next_of_kin_relationship}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, next_of_kin_relationship: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-4 mb-3">
      <label>Next of Kin Phone</label>
      <INPUT
        type="tel"
        value={employee.details.next_of_kin_phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, next_of_kin_phone: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Next of Kin Email</label>
      <INPUT
        type="email"
        value={employee.details.next_of_kin_email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, next_of_kin_email: e.target.value } })}
      />
    </div>
    <div className="col-md-4 mb-3">
      <label>Next of Kin Gender</label>
      <INPUT
        type="text"
        value={employee.details.next_of_kin_gender}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, next_of_kin_gender: e.target.value } })}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Next of Kin Occupation</label>
      <INPUT
        type="text"
        value={employee.details.next_of_kin_occupation}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployee({ ...employee, details: { ...employee.details, next_of_kin_occupation: e.target.value } })}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Next of Kin Address</label>
      <TEXTAREA
        value={employee.details.next_of_kin_address}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmployee({ ...employee, details: { ...employee.details, next_of_kin_address: e.target.value } })}
      />
    </div>
  </div>
          <div className="mt-3">
            <BLOCKBUTTON type="submit">Update Employee</BLOCKBUTTON>
          </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;