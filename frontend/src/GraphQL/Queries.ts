import { gql } from '@apollo/client';



export const GET_CONFIG = gql`
query Query {
  getConfig
}
`;

export const CURRENT_USER = gql`
query Query {
  currentUser {
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
// ACCOUNTING
export const GET_ACCOUNTING_YEARS = gql`
query GetAllAccountingyears($companyId: Int, $offset: Int) {
  getAllAccountingyears(company_id: $companyId, offset: $offset) {
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


//TRANSACTIONS
export const GET_ALL_TRANSACTIONS = gql`
query GetAllTransactions($companyId: Int, $offset: Int, $branch_id: Int, $accounting_year: Int) {
  getAllTransactions(company_id: $companyId, offset: $offset, branch_id: $branch_id, accounting_year: $accounting_year) {
    id
    company_id
    branch_id
    account_id
    accounting_year_id
    code
    value_date
    amount
    created_at
    remarks
    counterpart
  }
}
`;

export const GET_ACCOUNT_TRANSACTIONS = gql`
query GetAccountTransactions ($company_id: Int, $branch_id: Int, $accounting_year_id: Int, $account_id: Int, $offset: Int) {
  getAccountTransactions(company_id: $company_id, branch_id: $branch_id, accounting_year_id: $accounting_year_id, account_id: $account_id, offset: $offset) {
    id
    company_id
    branch_id
    account_id
    accounting_year_id
    code
    value_date
    amount
    created_at
    remarks
    counterpart
  }
}
`;

export const GET_CODE_TRANSACTIONS = gql`
query GetCodeTransactions ($company_id: Int, $branch_id: Int, $accounting_year_id: Int, $code: Int, $offset: Int) {
  getCodetransactions(company_id: $company_id, branch_id: $branch_id, accounting_year_id: $accounting_year_id, code: $code, offset: $offset) {
    id
    company_id
    branch_id
    account_id
    accounting_year_id
    code
    value_date
    amount
    created_at
    remarks
    counterpart
  }
}
`;

export const GET_TYPE_TRANSACTIONS = gql`
query GetTypeTransactions($company_id: Int, $branch_id: Int, $accounting_year_id: Int, $type: AccountTypes, $offset: Int) {
  getTypetransactions(company_id: $company_id, branch_id: $branch_id, accounting_year_id: $accounting_year_id, type: $type, offset: $offset) {
    id
    company_id
    branch_id
    account_id
    accounting_year_id
    code
    value_date
    amount
    created_at
    remarks
    counterpart
  }
}
`;

export const GET_CATEGORY_TRANSACTIONS = gql`
query GetCategoryTransactions($company_id: Int, $branch_id: Int, $accounting_year_id: Int, $category: AccountCategoryTypes, $offset: Int) {
  getCategorytransactions(company_id: $company_id, branch_id: $branch_id, accounting_year_id: $accounting_year_id, category: $category, offset: $offset) {
    id
    company_id
    branch_id
    account_id
    accounting_year_id
    code
    value_date
    amount
    created_at
    remarks
    counterpart
  }
}
`;




// ASSETS_CATEGORY
export const GET_ASSET_CATEGORY = gql`
query GetAllAssetCategories($companyId: Int, $status: AssetStatus, $offset: Int) {
  getAllAssetCategories(company_id: $companyId, status: $status, offset: $offset) {
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

// ASSET_ITEM
export const GET_ASSET_ITEM = gql`
query GetAllAssetsItems($companyId: Int, $status: AssetStatus, $offset: Int) {
  getAllAssetsItems(company_id: $companyId, status: $status, offset: $offset) {
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

// ASSETS BY CATEGORY
export const GET_ASSETS_BY_CATEGORY = gql`
query GetAssetsByCategory($companyId: Int, $categoryId: Int, $status: AssetStatus, $offset: Int) {
  getAssetsByCategory(company_id: $companyId, category_id: $categoryId, status: $status, offset: $offset) {
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

//ASSETS BY LOCATION
export const GET_ASSETS_BY_LOCATION = gql`
query GetAssetsByLocation($companyId: Int, $locationId: Int, $status: AssetStatus, $offset: Int) {
  getAssetsByLocation(company_id: $companyId, location_id: $locationId, status: $status, offset: $offset) {
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

// ASSETS BY VENDOR
export const GET_ASSETS_BY_VENDOR = gql`
query GetAssetsByVendor($companyId: Int, $vendorId: Int, $status: AssetStatus, $offset: Int) {
  getAssetsByVendor(company_id: $companyId, vendor_id: $vendorId, status: $status, offset: $offset) {
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

// ASSETS BY PURCHASE DATE
export const GET_ASSETS_BY_PURCHASE_DATE = gql`
query GetAssetsByPurchaseDate($companyId: Int, $purchaseDateStart: String, $purchaseDateEnd: String, $status: AssetStatus, $offset: Int) {
  getAssetsByPurchaseDate(company_id: $companyId, purchase_date_start: $purchaseDateStart, purchase_date_end: $purchaseDateEnd, status: $status, offset: $offset) {
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

// GET ASSETS DEPRECIATION
export const GET_ASSETS_DEPRECIATION = gql`
query GetAssetsDepreciation($companyId: Int, $offset: Int, $assetId: Int) {
  getAssetsDepreciation(company_id: $companyId, offset: $offset, asset_id: $assetId) {
       id
    company_id
    item_id
    tx_code
    depreciation_method: DepreciationMethod
    depreciation_amount
    created_at
  }
  
}
`;


// COMPANY
export const GET_COMPANY = gql`
query GetMyCompanies {
  getMyCompanies {
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

export const GET_COMPANY_BRANCHES = gql`
query GetAllCompanyBranches($companyId: Int, $offset: Int) {
  getAllCompanyBranches(company_id: $companyId, offset: $offset) {
    id
    name
    settings
  }
}
`;

export const GET_COMPANY_ROLES = gql`
query GetAllCompanyRoles($companyId: Int, $offset: Int) {
  getAllCompanyRoles(company_id: $companyId, offset: $offset) {
    id
    name
    json
    status
  }
}
`;

export const GET_COMPANY_PROFILE = gql`
query GetFullCompanyProfile($companyId: Int) {
  getFullCompanyProfile(company_id: $companyId) {
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

export const GET_COMPANY_USERS = gql`
query GetAllCompanyUsers($companyId: Int, $offset: Int) {
  getAllCompanyUsers(company_id: $companyId, offset: $offset) {
    id
    title
    firstname
    lastname
    email
    phone
  }
}
`;

// CUSTOMERS
export const GET_CUSTOMERS = gql`
query GetAllCustomers($companyId: Int, $offset: Int) {
  getAllCustomers(company_id: $companyId, offset: $offset) {
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

// DEPARTMENT

export const GET_DEPARTMENTS = gql`
query GetAllDepartments($offset: Int, $companyId: Int) {
  getAllDepartments(offset: $offset, company_id: $companyId) {
    id
    name
    description
    created_at
    updated_at
  }
}
`;

// EMPLOYEE

export const GET_ALL_EMPLOYEES = gql`
query GetAllEmployees($companyId: Int, $offset: Int) {
  getAllEmployees(company_id: $companyId, offset: $offset) {
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
export const GET_ALL_ATTENDANCE = gql`
query GetAllEmployeeAttendance($companyId: Int, $attendanceDateStart: String, $attendanceDateEnd: String) {
  getAllEmployeeAttendance(company_id: $companyId, attendance_date_start: $attendanceDateStart, attendance_date_end: $attendanceDateEnd) {
    id
    company_id
    employee_id
    date
    time_in
    time_out
    created_at
    updated_at
  }
}
`;

export const GET_EMPLOYEE_ATTENDANCE = gql`
query GetEmployeeAttendance($companyId: Int, $employeeId: Int, $attendanceDateStart: String, $attendanceDateEnd: String) {
  getEmployeeAttendance(company_id: $companyId, employee_id: $employeeId, attendance_date_start: $attendanceDateStart, attendance_date_end: $attendanceDateEnd) {
    id
    company_id
    employee_id
    date
    time_in
    time_out
    created_at
    updated_at
  }
}
`;

export const GET_EMPLOYEE_QUALIFICATIONS = gql`
query GetEmployeeQualifications ($companyId: Int, $employeeId: Int, $offset: Int) {
  getEmployeeQualifications(company_id: $companyId, employee_id: $employeeId, offset: $offset) {
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

export const GET_EMPLOYEE_PERFORMANCE_REVIEWS = gql`
query GetEmployeePerformanceReviews ($companyId: Int, $employeeId: Int, $offset: Int) {
  getEmployeePerformanceReviews(company_id: $companyId, employee_id: $employeeId, offset: $offset) {
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



// JOB TITLE
export const GET_JOB_TITLE = gql`
query GetAllJobTitles($companyId: Int, $offset: Int) {
  getAllJobTitles(company_id: $companyId, offset: $offset) {
    id
    name
    description
    created_at
    updated_at
  }
}
`;

// LEDGER
export const GET_LEDGER = gql`
query GetAllLedgers($companyId: Int, $offset: Int) {
  getAllLedgers(company_id: $companyId, offset: $offset) {
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



// VENDOR
export const GET_ALL_VENDORS = gql`
query GetAllVendors($companyId: Int, $offset: Int) {
  getAllVendors(company_id: $companyId, offset: $offset) {
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

// USER
export const GET_USERS_LINK = gql`
query GetUsersLinkedToMyCompany($companyId: Int, $offset: Int) {
  getUsersLinkedToMyCompany(company_id: $companyId, offset: $offset) {
    id
    title
    firstname
    lastname
    email
    phone
  }
}
`;

export const GET_PENDING_LINKS = gql`
query GetUsersLinkedToMyCompany($companyId: Int, $offset: Int) {
  getUsersLinkedToMyCompany(company_id: $companyId, offset: $offset) {
    id
    title
    firstname
    lastname
    email
    phone
  }
}
`;


// PAYROLL
export const GET_ALL_PAYROLL = gql`
query GetAllPayrolls($companyId: Int, $offset: Int) {
  getAllPayrolls(company_id: $companyId, offset: $offset) {
    id
    company_id
    branch_id
    name
    code
    schedule
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