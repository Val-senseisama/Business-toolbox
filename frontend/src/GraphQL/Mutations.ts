import { gql } from '@apollo/client';


export const REGISTER = gql`
mutation Register($email: String, $password: String, $title: String, $firstname: String, $lastname: String, $phonenumber: String, $dateOfBirth: String, $gender: Gender!) {
  register(email: $email, password: $password, title: $title, firstname: $firstname, lastname: $lastname, phonenumber: $phonenumber, date_of_birth: $dateOfBirth, gender: $gender)
}
`;
export const UPDATE_PROFILE = gql`
mutation UpdateProfile($title: String, $firstname: String, $lastname: String, $phone: String, $gender: String, $dateOfBirth: String) {
  updateProfile(title: $title, firstname: $firstname, lastname: $lastname, phone: $phone, gender: $gender, date_of_birth: $dateOfBirth) {
    id
    title
    firstname
    lastname
    email
    phone
    date_of_birth
    gender
    data
    settings
    created_at
  }
}
`;

export const UPDATE_USER_SETTINGS = gql`
mutation UpdateUserSettings($settings: JSON) {
  updateUserSettings(settings: $settings)
}
`;

export const LOGIN = gql`
mutation Login($email: String, $password: String) {
  login(email: $email, password: $password) {
    accessToken
    refreshToken
  }
}
`;

export const VERIFY_EMAIL = gql`
mutation VerifyEmail($token: String, $email: String) {
  verifyEmail(token: $token, email: $email)
}
`;

export const RESET_PASSWORD = gql`
mutation ResetPassword($email: String, $token: String, $password: String) {
  resetPassword(email: $email, token: $token, password: $password) {
    accessToken
    refreshToken
  }
}
`;

export const CHANGE_PASSWORD = gql`
 mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
}
`;

export const FORGOT_PASSWORD = gql`
mutation ForgotPassword($email: String) {
  forgotPassword(email: $email)
}
`;

export const UPDATE_FIREBASE_TOKEN = gql`
mutation UpdateFirebaseToken($token: String) {
  updateFirebaseToken(token: $token)
}
`;

// ROLES
export const CREATE_ROLE = gql`
mutation CreateRole($companyId: Int, $name: String, $json: JSON) {
  createRole(company_id: $companyId, name: $name, json: $json) {
    id
    name
    json
    status
  }
}
`;

export const UPDATE_ROLE = gql`
mutation UpdateRole($updateRoleId: Int, $companyId: Int, $name: String, $json: JSON, $status: String) {
  updateRole(id: $updateRoleId, company_id: $companyId, name: $name, json: $json, status: $status) {
    id
    name
    json
    status
  }
}
`;

export const DELETE_ROLE = gql`
mutation DeleteRole($deleteRoleId: Int, $companyId: Int) {
  deleteRole(id: $deleteRoleId, company_id: $companyId)
}
`;


// COMPANY
export const CREATE_COMPANY = gql`
mutation CreateCompany($name: String, $about: String, $address: String, $city: String, $state: String, $country: String, $phone: String, $email: String, $website: String, $industry: String, $logo: String, $settings: JSON) {
  createCompany(name: $name, about: $about, address: $address, city: $city, state: $state, country: $country, phone: $phone, email: $email, website: $website, industry: $industry, logo: $logo, settings: $settings) {
    id
    name
    about
    address
    city
    state
    country
    phone
    email
    website
    industry
    logo
    accounting_year_id
    settings
    plan
    plan_expiry
    created_at
    updated_at
  }
}
`;
export const UPDATE_COMPANY = gql`
mutation UpdateCompany($updateCompanyId: Int, $name: String, $about: String, $address: String, $city: String, $state: String, $country: String, $phone: String, $website: String, $email: String, $industry: String, $logo: String, $settings: JSON) {
  updateCompany(id: $updateCompanyId, name: $name, about: $about, address: $address, city: $city, state: $state, country: $country, phone: $phone, website: $website, email: $email, industry: $industry, logo: $logo, settings: $settings) {
    id
    name
    about
    address
    city
    state
    country
    phone
    email
    website
    industry
    logo
    accounting_year_id
    settings
    plan
    plan_expiry
    created_at
    updated_at
  }
}
`;

export const UPDATE_COMPANY_SETTINGS = gql`
mutation UpdateCompanySettings($companyId: Int, $settings: JSON) {
  updateCompanySettings(company_id: $companyId, settings: $settings)
}
`;

export const DELETE_COMPANY = gql`
mutation DeleteCompany($deleteCompanyId: Int) {
  deleteCompany(id: $deleteCompanyId)
}
`;

export const ACCEPT_PENDING_COMPANY_LINK = gql`
mutation AcceptPendingCompanyLink($userCompanyId: Int, $companyId: Int) {
  acceptPendingCompanyLink(user_company_id: $userCompanyId, company_id: $companyId) {
     id
    name
    about
    address
    city
    state
    country
    phone
    email
    accounting_year_id
    website
    logo
  }
}
`;

// COMPANY BRANCH
export const CREATE_COMPANY_BRANCH =  gql`
mutation CreateCompanyBranch($companyId: Int, $name: String, $description: String, $settings: JSON) {
  createCompanyBranch(company_id: $companyId, name: $name, description: $description, settings: $settings) {
    id
    name
    settings
  }
}
`;

export const UPDATE_COMPANY_BRANCH = gql`
mutation UpdateCompanyBranch($companyId: Int, $branchId: Int, $description: String, $name: String, $settings: JSON) {
  updateCompanyBranch(company_id: $companyId, branch_id: $branchId, description: $description, name: $name, settings: $settings) {
    id
    name
    settings
  }
}
`;

export const DELETE_COMPANY_BRANCH = gql`
mutation DeleteCompanyBranch($companyId: Int, $branchId: Int) {
  deleteCompanyBranch(company_id: $companyId, branch_id: $branchId)
}
`;

// DEPARTMENT
export const CREATE_DEPARTMENT = gql`
mutation CreateCompanyBranch($companyId: Int, $name: String, $description: String, $settings: JSON) {
  createCompanyBranch(company_id: $companyId, name: $name, description: $description, settings: $settings) {
    id
    name
    settings
  }
}
`;

export const UPDATE_DEPARTMENT = gql`
mutation UpdateDepartment($updateDepartmentId: Int, $companyId: Int, $name: String, $description: String) {
  updateDepartment(id: $updateDepartmentId, company_id: $companyId, name: $name, description: $description) {
    id
    name
    description
    created_at
    updated_at
  }
}
`;

export const DELETE_DEPARTMENT = gql`
mutation DeleteDepartment($deleteDepartmentId: Int, $companyId: Int) {
  deleteDepartment(id: $deleteDepartmentId, company_id: $companyId)
}
`;

// EMPLOYEE
export const CREATE_EMPLOYEE = gql`
mutation CreateEmployee($companyId: Int, $branchId: Int, $details: EmployeeDetails) {
  createEmployee(company_id: $companyId, branch_id: $branchId, details: $details) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;

export const UPDATE_EMPLOYEE = gql`
mutation UpdateEmployee($updateEmployeeId: Int, $companyId: Int, $branchId: Int, $details: EmployeeDetails) {
  updateEmployee(id: $updateEmployeeId, company_id: $companyId, branch_id: $branchId, details: $details) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;


export const DELETE_EMPLOYEE = gql`
mutation DeleteEmployee($deleteEmployeeId: Int, $companyId: Int) {
  deleteEmployee(id: $deleteEmployeeId, company_id: $companyId)
}
`;

// CHECKIN_CHECKOUT
export const CHECK_EMPLOYEE_IN = gql`
mutation CheckEmployeeIn($companyId: Int, $employeeId: Int) {
  checkEmployeeIn(company_id: $companyId, employee_id: $employeeId)
}
`;

export const UPDATE_EMPLOYEE_ATTENDANCE = gql`
mutation UpdateEmployeeAttendance($companyId: Int, $employeeId: Int, $attendanceDate: String, $checkIn: String, $checkOut: String) {
  updateEmployeeAttendance(company_id: $companyId, employee_id: $employeeId, attendance_date: $attendanceDate, check_in: $checkIn, check_out: $checkOut)
}
`;

export const UPDATE_MULTIPLE_ATTENTANCE = gql`
mutation UpdateMultipleEmployeeAttendance($companyId: Int, $employeeIds: [Int], $attendanceDate: String, $checkIn: String, $checkOut: String) {
  updateMultipleEmployeeAttendance(company_id: $companyId, employee_ids: $employeeIds, attendance_date: $attendanceDate, check_in: $checkIn, check_out: $checkOut)
}
`;

export const CHECK_EMPLOYEE_OUT = gql`
mutation CheckEmployeeOut($companyId: Int, $employeeId: Int) {
  checkEmployeeOut(company_id: $companyId, employee_id: $employeeId)
}
`;

// JOB_TITLE
export const CREATE_JOB_TITLE = gql`
mutation CreateJobTitle($companyId: Int, $name: String, $description: String) {
  createJobTitle(company_id: $companyId, name: $name, description: $description) {
    id
    name
    description
    created_at
    updated_at
  }
}
`;

export const UPDATE_JOB_TITLE = gql`
mutation UpdateJobTitle($updateJobTitleId: Int, $companyId: Int, $name: String, $description: String) {
  updateJobTitle(id: $updateJobTitleId, company_id: $companyId, name: $name, description: $description) {
    id
    name
    description
    created_at
    updated_at
  }
}
`;

export const DELETE_JOB_TITLE = gql`
mutation DeleteJobTitle($deleteJobTitleId: Int, $companyId: Int) {
  deleteJobTitle(id: $deleteJobTitleId, company_id: $companyId)
}
`;

// CUSTOMER
export const CREATE_CUSTOMER = gql`
mutation CreateCustomer($companyId: Int, $branchId: Int, $details: CustomerDetails) {
  createCustomer(company_id: $companyId, branch_id: $branchId, details: $details) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;

export const UPDATE_CUSTOMER = gql`
mutation UpdateCustomer($updateCustomerId: Int, $companyId: Int, $branchId: Int, $details: CustomerDetails) {
  updateCustomer(id: $updateCustomerId, company_id: $companyId, branch_id: $branchId, details: $details) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;

export const DELETE_CUSTOMER = gql`
mutation DeleteCustomer($companyId: Int, $deleteCustomerId: Int) {
  deleteCustomer(company_id: $companyId, id: $deleteCustomerId)
}
`;


// ASSET_CATEGORY
export const CREATE_ASSET_CATEGORY = gql`
mutation CreateAssetCategory($companyId: Int, $name: String, $description: String, $depreciationMethod: String, $usefulLifeYears: Float, $salvageValue: Float) {
  createAssetCategory(company_id: $companyId, name: $name, description: $description, depreciation_method: $depreciationMethod, useful_life_years: $usefulLifeYears, salvage_value: $salvageValue) {
    id
    company_id
    name
    description
    depreciation_method
    useful_life_years
    salvage_value
    created_at
    updated_at
  }
}
`;

export const UPDATE_ASSET_CATEGORY = gql`
mutation UpdateAssetCategory($updateAssetCategoryId: Int, $companyId: Int, $name: String, $description: String, $depreciationMethod: String, $usefulLifeYears: Float, $salvageValue: Float) {
  updateAssetCategory(id: $updateAssetCategoryId, company_id: $companyId, name: $name, description: $description, depreciation_method: $depreciationMethod, useful_life_years: $usefulLifeYears, salvage_value: $salvageValue) {
    id
    company_id
    name
    description
    depreciation_method
    useful_life_years
    salvage_value
    created_at
    updated_at
  }
}
`;

export const DELETE_ASSET_CATEGORY = gql`
mutation DeleteAssetCategory($deleteAssetCategoryId: Int, $companyId: Int) {
  deleteAssetCategory(id: $deleteAssetCategoryId, company_id: $companyId)
}
`;

// ASSET ITEMS
export const CREATE_ASSET_ITEM = gql`
mutation CreateAssetItem($companyId: Int, $branchId: Int, $vendorId: Int, $locationId: Int, $categoryId: Int, $tag: String, $serialNumber: String, $name: String, $description: String, $purchaseDate: String, $purchaseCost: Float, $latestValue: Float, $status: AssetStatus) {
  createAssetItem(company_id: $companyId, branch_id: $branchId, vendor_id: $vendorId, location_id: $locationId, category_id: $categoryId, tag: $tag, serial_number: $serialNumber, name: $name, description: $description, purchase_date: $purchaseDate, purchase_cost: $purchaseCost, latest_value: $latestValue, status: $status) {
    id
    company_id
    branch_id
    vendor_id
    location_id
    category_id
    tag
    serial_number
    name
    description
    purchase_date
    purchase_cost
    latest_value
    status
    created_at
    updated_at
  }
}
`;

export const UPDATE_ASSET_ITEM = gql`
mutation UpdateAssetItem($updateAssetItemId: Int, $companyId: Int, $branchId: Int, $vendorId: Int, $locationId: Int, $categoryId: Int, $tag: String, $serialNumber: String, $name: String, $description: String, $purchaseDate: String, $purchaseCost: Float, $latestValue: Float, $status: AssetStatus) {
  updateAssetItem(id: $updateAssetItemId, company_id: $companyId, branch_id: $branchId, vendor_id: $vendorId, location_id: $locationId, category_id: $categoryId, tag: $tag, serial_number: $serialNumber, name: $name, description: $description, purchase_date: $purchaseDate, purchase_cost: $purchaseCost, latest_value: $latestValue, status: $status) {
    id
    company_id
    branch_id
    vendor_id
    location_id
    category_id
    tag
    serial_number
    name
    description
    purchase_date
    purchase_cost
    latest_value
    status
    created_at
    updated_at
  }
}
`;

export const DELETE_ASSET_ITEM = gql`
mutation DeleteAssetCategory($deleteAssetCategoryId: Int, $companyId: Int) {
  deleteAssetCategory(id: $deleteAssetCategoryId, company_id: $companyId)
}
`;


// LEDGER
export const CREATE_LEDGER =  gql`
mutation CreateLedger($companyId: Int, $branchId: Int, $details: LedgerDetails, $type: AccountTypes) {
  createLedger(company_id: $companyId, branch_id: $branchId, details: $details, type: $type) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;

export const UPDATE_LEDGER = gql`
mutation UpdateLedger($updateLedgerId: Int, $companyId: Int, $branchId: Int, $details: LedgerDetails) {
  updateLedger(id: $updateLedgerId, company_id: $companyId, branch_id: $branchId, details: $details) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;

export const DELETE_LEDGER = gql`
mutation DeleteLedger($companyId: Int, $deleteLedgerId: Int) {
  deleteLedger(company_id: $companyId, id: $deleteLedgerId)
}
`;

// VENDOR
export const CREATE_VENDOR = gql`
mutation CreateVendor($companyId: Int, $branchId: Int, $details: VendorDetails) {
  createVendor(company_id: $companyId, branch_id: $branchId, details: $details) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;

export const UPDATE_VENDOR = gql`
mutation UpdateVendor($updateVendorId: Int, $companyId: Int, $branchId: Int, $details: VendorDetails) {
  updateVendor(id: $updateVendorId, company_id: $companyId, branch_id: $branchId, details: $details) {
    id
    company_id
    branch_id
    details
    type
    category
    balance
    created_at
    updated_at
  }
}
`;

export const DELETE_VENDOR = gql`
mutation DeleteVendor($companyId: Int, $deleteVendorId: Int) {
  deleteVendor(company_id: $companyId, id: $deleteVendorId)
}
`;


// ACCOUNTING_YEAR
export const CREATE_ACCOUNTING_YEAR = gql`
mutation CreateAccountingYear($companyId: Int, $name: String, $startDate: String, $endDate: String) {
  createAccountingYear(company_id: $companyId, name: $name, start_date: $startDate, end_date: $endDate) {
    id
    company_id
    name
    start_date
    end_date
    status
    created_at
    updated_at
  }
}
`;

export const UPDATE_ACCOUNTING_YEAR = gql`
mutation UpdateAccountingYear($updateAccountingYearId: Int, $companyId: Int, $name: String, $startDate: String, $endDate: String) {
  updateAccountingYear(id: $updateAccountingYearId, company_id: $companyId, name: $name, start_date: $startDate, end_date: $endDate) {
    id
    company_id
    name
    start_date
    end_date
    status
    created_at
    updated_at
  }
}
`;

export const CLOSE_ACCOUNTING_YEAR = gql`
mutation CloseAccountingYear($closeAccountingYearId: Int, $companyId: Int, $newAccountingYearId: Int) {
  closeAccountingYear(id: $closeAccountingYearId, company_id: $companyId, new_accounting_year_id: $newAccountingYearId)
}
`;

export const DELETE_ACCOUNTING_YEAR = gql`
mutation DeleteAccountingYear($companyId: Int, $deleteAccountingYearId: Int) {
  deleteAccountingYear(company_id: $companyId, id: $deleteAccountingYearId)
}
`;


// PERFORMANCE_REVIEW
export const CREATE_PERFORMANCE_REVIEW = gql`
mutation CreatePerformanceReview($companyId: Int, $employeeId: Int, $reviewerId: Int, $reviewDate: String, $rating: Int, $comments: String) {
  createPerformanceReview(company_id: $companyId, employee_id: $employeeId, reviewer_id: $reviewerId, review_date: $reviewDate, rating: $rating, comments: $comments) {
    id
    company_id
    employee_id
    reviewer_id
    review_date
    rating
    comments
    created_at
    updated_at
  }
}
`;

export const UPDATE_PERFORMNCE_REVIEW = gql`
mutation UpdatePerformanceReview($updatePerformanceReviewId: Int, $companyId: Int, $reviewerId: Int, $reviewDate: String, $rating: Int, $comments: String) {
  updatePerformanceReview(id: $updatePerformanceReviewId, company_id: $companyId, reviewer_id: $reviewerId, review_date: $reviewDate, rating: $rating, comments: $comments) {
    id
    company_id
    employee_id
    reviewer_id
    review_date
    rating
    comments
    created_at
    updated_at
  }
}
`;

export const DELETE_PERFORMANCE_REVIEW = gql`
mutation DeletePerformanceReview($deletePerformanceReviewId: Int, $companyId: Int) {
  deletePerformanceReview(id: $deletePerformanceReviewId, company_id: $companyId)
}
`;

export const CREATE_QUALIFICATION = gql`
mutation CreateQualification($companyId: Int, $employeeId: Int, $type: QualificationTypes, $dateObtained: String, $description: String) {
  createQualification(company_id: $companyId, employee_id: $employeeId, type: $type, date_obtained: $dateObtained, description: $description) {
    id
    company_id
    employee_id
    type
    description
    date_obtained
    created_at
    updated_at
  }
}
`;

export const UPDATE_QUALIFICATION = gql`
mutation UpdateQualification($updateQualificationId: Int, $companyId: Int, $employeeId: Int, $type: QualificationTypes, $dateObtained: String, $description: String) {
  updateQualification(id: $updateQualificationId, company_id: $companyId, employee_id: $employeeId, type: $type, date_obtained: $dateObtained, description: $description) {
    id
    company_id
    employee_id
    type
    description
    date_obtained
    created_at
    updated_at
  }
}
`;

export const DELETE_QUALIFICATION = gql`
mutation DeleteQualification($deleteQualificationId: Int, $companyId: Int) {
  deleteQualification(id: $deleteQualificationId, company_id: $companyId)
}
`;


export const ADD_USER_TO_COMPANY = gql`
mutation AddUserToCompany($email: String, $companyId: Int, $branchId: Int) {
  addUserToCompany(email: $email, company_id: $companyId, branch_id: $branchId) {
    id
    title
    firstname
    lastname
    email
    phone
  }
}
`;
export const REMOVE_USER_FROM_COMPANY = gql`
mutation RemoveUserFromCompany($userCompanyId: Int, $email: String, $companyId: Int) {
  removeUserFromCompany(user_company_id: $userCompanyId, email: $email, company_id: $companyId) {
    id
    title
    firstname
    lastname
    email
    phone
  }
}
`;


//TRANSACTIONS

export const POST_TRANSACTION = gql`
mutation PostTransaction($companyId: Int, $branchId: Int, $source: [TransactionComponent!], $destination: [TransactionComponent!], $valueDate: String, $remarks: String) {
  postTransaction(company_id: $companyId, branch_id: $branchId, source: $source, destination: $destination, value_date: $valueDate, remarks: $remarks) {
    id
    company_id
    branch_id
    account_id
    accounting_year_id
    code
    amount
    value_date
    remarks
    counterpart
    created_at
  }
}
`;

export const DELETE_TRANSACTION = gql`
mutation PostTransaction($companyId: Int, $branchId: Int, $deleteTransactionId: Int) {
  deleteTransaction(company_id: $companyId, branch_id: $branchId, id: $deleteTransactionId)
}
`;


// PAYROLL 

export const CREATE_PAYROLL = gql`
mutation CreatePayroll($companyId: Int, $branchId: Int, $name: String, $schedule: [SalaryScheduleInput], $salariesTotal: Float) {
  createPayroll(company_id: $companyId, branch_id: $branchId, name: $name, schedule: $schedule, salaries_total: $salariesTotal) {
    id
    company_id
    branch_id
    name
    code
    schedule {
      employee_id
      employee_name
      employee_bank_details
      gross_pay
      loan_repayment
      penalties
      union_dues
      health
      retirements
      other_deductions
      income_tax
      net_pay
    }
    salaries_total
    tax_total
    salaries_liabilities_posted
    salaries_expenses_posted
    loan_liabilities_posted
    loan_expenses_posted
    penalties_liabilities_posted
    penalties_expenses_posted
    union_dues_liabilities_posted
    union_dues_expenses_posted
    health_liabilities_posted
    health_expenses_posted
    retirements_liabilities_posted
    retirements_expenses_posted
    other_deductions_liabilities_posted
    other_deductions_expenses_posted
    tax_liabilities_posted
    tax_expenses_posted
    created_at
    updated_at
  }
}
`;

export const UPDATE_PAYROLL = gql`
mutation UpdatePayroll($updatePayrollId: Int, $companyId: Int, $branchId: Int, $name: String, $schedule: [SalaryScheduleInput], $salariesTotal: Float) {
  updatePayroll(id: $updatePayrollId, company_id: $companyId, branch_id: $branchId, name: $name, schedule: $schedule, salaries_total: $salariesTotal) {
    id
    company_id
    branch_id
    name
    code
    schedule {
      employee_id
      employee_name
      employee_bank_details
      gross_pay
      loan_repayment
      penalties
      union_dues
      health
      retirements
      other_deductions
      income_tax
      net_pay
    }
    salaries_total
    tax_total
    salaries_liabilities_posted
    salaries_expenses_posted
    loan_liabilities_posted
    loan_expenses_posted
    penalties_liabilities_posted
    penalties_expenses_posted
    union_dues_liabilities_posted
    union_dues_expenses_posted
    health_liabilities_posted
    health_expenses_posted
    retirements_liabilities_posted
    retirements_expenses_posted
    other_deductions_liabilities_posted
    other_deductions_expenses_posted
    tax_liabilities_posted
    tax_expenses_posted
    created_at
    updated_at
  }
}
`;

export const DELETE_PAYROLL = gql`
mutation DeletePayroll($companyId: Int, $deletePayrollId: Int) {
  deletePayroll(company_id: $companyId, id: $deletePayrollId)
}`;

export const POST_PAYROLL_LIABILITY = gql`
mutation PostPayrollLiability($companyId: Int, $payrollId: Int, $branchId: Int, $headerName: String) {
  postPayrollLiability(company_id: $companyId, payroll_id: $payrollId, branch_id: $branchId, header_name: $headerName)
}
`;

export const POST_PAYROLL_EXPENSE = gql`
mutation PostPayrollExpense($companyId: Int, $branchId: Int, $payrollId: Int, $headerName: String, $bankId: Int) {
  postPayrollExpense(company_id: $companyId, branch_id: $branchId, payroll_id: $payrollId, header_name: $headerName, bank_id: $bankId)
}`;