export default `#graphql

  scalar JSON
  
  type Query {
    #Phase 1
    currentUser: User!
    getConfig: JSON  
    getMyCompanies: [CompanyBasic!]
    getFullCompanyProfile(company_id: Int): Company!
    getUsersLinkedToMyCompany(company_id: Int, offset: Int): [UserBasic!]
    getAllCompanyBranches(company_id: Int, offset: Int): [Branch!]
    getAllCompanyUsers(company_id: Int, offset: Int): [UserBasic!]
    getAllCompanyRoles(company_id: Int, offset: Int): [Role!]
    getMyPendingCompanyLinks: [CompanyBasic!]


    #### Phase 2
    # Accounting
    getAllLedgers(company_id: Int, offset: Int): [Account!]
    getAllAccountingyears(company_id: Int, offset: Int): [AccountingYear!]
    getAlltransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, offset: Int): [Transaction!]
    getAccounttransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, account_id: Int, offset: Int): [Transaction!]
    getCodetransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, code: Int, offset: Int): [Transaction!]
    getTypetransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, type: AccountTypes, offset: Int): [Transaction!]
    getCategorytransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, category: AccountCategoryTypes, offset: Int): [Transaction!]
    getAllCustomers(company_id: Int, offset: Int): [Account!]
    getAllVendors(company_id: Int, offset: Int): [Account!]
    getAllPayrolls(company_id: Int, offset: Int): [Payroll!]


    #### Phase 3
    # HR
    getAllDepartments(company_id: Int, offset: Int): [Department!]
    getAllJobTitles(company_id: Int, offset: Int): [JobTitle!]
    getAllEmployees(company_id: Int, offset: Int): [Account!]
    getEmployeeQualifications(company_id: Int, employee_id: Int, offset: Int): [Qualification!]
    getEmployeePerformanceReviews(company_id: Int, employee_id: Int, offset: Int): [PerformanceReview!]


    #### Phase 4
    # Fixed Assets
    getAllAssetCategories(company_id: Int, status: AssetStatus, offset: Int): [AssetCategory!]
    getAllAssetsItems(company_id: Int, status: AssetStatus, offset: Int): [FixedAsset!]
    getAssetsByCategory(company_id: Int, status: AssetStatus, category_id: Int, offset: Int): [FixedAsset!]
    getAssetsByLocation(company_id: Int, status: AssetStatus, location_id: Int, offset: Int): [FixedAsset!]
    getAssetsByVendor(company_id: Int, status: AssetStatus, vendor_id: Int, offset: Int): [FixedAsset!]
    getAssetsByPurchaseDate(company_id: Int, status: AssetStatus, purchase_date_start: String, purchase_date_end: String, offset: Int): [FixedAsset!]
    getAssetDepreciation(company_id: Int, asset_id: Int, offset: Int): [AssetDepreciation!]

  }

  type Mutation {
    #### Phase 1
    # User Management, Authentication and Session Management
    login(email: String, password: String): JWT!
    register(email: String, password: String, title: String, first_name: String, last_name: String, phone_number: String): Int!
    forgotPassword(email: String): Int!
    resetPassword(email: String, token: String, password: String): JWT!
    updateProfile( title: String, firstname: String,lastname: String, phone: String, gender: String,date_of_Birth: String): User!
    changePassword(oldPassword: String!, newPassword: String!): Int!
    verifyEmail(token: String, email: String): Int!
    updateFirebaseToken(token: String): Int!
    updateUserSettings(settings: JSON): JSON #returns settings object of the user

    # Company Management
    createCompany(name: String, about: String, address: String, city: String, state: String, country: String, phone: String, email: String, website: String, industry: String, logo: String, settings: JSON): Company!
    updateCompany(id: Int, name: String, about: String, address: String, city: String, state: String, country: String, phone: String, email: String, website: String, industry: String, logo: String, settings: JSON): Company!
    deleteCompany(id: Int): Int !#returns deleted company id
    addUserToCompany(email: String, company_id: Int): UserBasic!
    removeUserFromCompany(user_company_id: Int, email: String, company_id: Int): UserBasic!
    createCompanyBranch(company_id: Int, name: String, settings: JSON): Branch!
    deleteCompanyBranch(company_id: Int, branch_id: Int): Int #returns deleted branch id
    updateCompanyBranch(company_id: Int, branch_id: Int, name: String, settings: JSON): Branch!
    acceptPendingCompanyLink(user_company_id: Int, company_id: Int): CompanyBasic!
    updateCompanySettings(company_id: Int, settings: JSON): JSON

    # Company Roles Management
    createRole(company_id: Int, name: String, json: JSON): Role!
    updateRole(id: Int, name: String, json: JSON, status: String): Role!
    deleteRole(id: Int): Int #returns deleted role id



    #### Phase 2
    # Accounting
    createLedger(company_id: Int, branch_id: Int, details: LedgerDetails, type: AccountTypes): Account!
    updateLedger(id: Int, company_id: Int, branch_id: Int, details: LedgerDetails): Account!
    deleteLedger(company_id: Int, id: Int): Int #returns deleted account id

    createCustomer(company_id: Int, branch_id: Int, details: CustomerDetails): Account!
    updateCustomer(id: Int, company_id: Int, branch_id: Int, details: CustomerDetails): Account!
    deleteCustomer(company_id: Int, id: Int): Int #returns deleted account id

    createVendor(company_id: Int, branch_id: Int, details: VendorDetails): Account!
    updateVendor(id: Int, company_id: Int, branch_id: Int, details: VendorDetails): Account!
    deleteVendor(company_id: Int, id: Int): Int #returns deleted account id

    createAccountingYear(company_id: Int, name: String, start_date: String, end_date: String): AccountingYear!
    updateAccountingYear(id: Int, company_id: Int, name: String, start_date: String, end_date: String): AccountingYear! #cant update a closed accounting year and cant update start_date for an active accounting year
    closeAccountingYear(id: Int, company_id: Int, new_accounting_year_id: id): Int
    deleteAccountingYear(company_id: Int, id: Int): Int #returns deleted accounting year id, cant only delete a pending accounting year
    
    postTransaction( company_id: Int, branch_id: Int, source: [TransactionComponent!], destination: [TransactionComponent!], value_date: String, remarks: String): [Transaction!]
    deleteTransaction(company_id: Int, branch_id: Int, id: Int): String #returns deleted transaction code

    createPayroll(company_id: Int, branch_id: Int, name: String, schedule: [SalarySchedule] ): Payroll!
    updatePayroll(id: Int, company_id: Int, branch_id: Int, name: String, schedule: [SalarySchedule] ): Payroll!
    deletePayroll(company_id: Int, id: Int): Int #returns deleted payroll id

    postPayrollLiability(company_id: Int, branch_id: Int, payroll_id: Int, header_name: String): Int
    postPayrollExpense(company_id: Int, branch_id: Int, payroll_id: Int, header_name: String, bank_id: Int): Int



    #### Phase 3
    # HR
    createDepartment(company_id: Int, name: String, description: String): Department!
    updateDepartment(id: Int, company_id: Int, name: String, description: String): Department!
    deleteDepartment(id: Int): Int #returns deleted department id

    createJobTitle(company_id: Int, name: String, description: String): JobTitle!
    updateJobTitle(id: Int, company_id: Int, name: String, description: String): JobTitle!
    deleteJobTitle(id: Int): Int #returns deleted job title id

    createEmployee(company_id: Int, branch_id: Int, details: EmployeeDetails): Account!
    updateEmployee(id: Int, company_id: Int, branch_id: Int, details: EmployeeDetails): Account!
    deleteEmployee(id: Int): Int #returns deleted employee id

    createQualification(company_id: Int, employee_id: Int, type: QualificationTypes, date_obtained: String, description: String): Qualification!
    updateQualification(id: Int, company_id: Int, employee_id: Int, type: QualificationTypes, date_obtained: String, description: String): Qualification!
    deleteQualification(id: Int): Int #returns deleted qualification id

    createPerformanceReview(company_id: Int, employee_id: Int, reviewer_id: Int, review_date: String, rating: Int, comments: String): PerformanceReview!
    updatePerformanceReview(id: Int, company_id: Int, employee_id: Int, reviewer_id: Int, review_date: String, rating: Int, comments: String): PerformanceReview!
    deletePerformanceReview(id: Int): Int #returns deleted performance review id



    #### Phase 4
    # Fixed Assets
    createAssetCategory(company_id: Int, name: String, description: String, depreciation_method: String, useful_life_years: Float, salvage_value: Float): AssetCategory!
    updateAssetCategory(id: Int, company_id: Int, name: String, description: String, depreciation_method: String, useful_life_years: Float, salvage_value: Float): AssetCategory!
    deleteAssetCategory(id: Int): Int #returns deleted asset category id

    createAssetItem(company_id: Int, branch_id: Int, vendor_id: Int, location_id: Int, category_id: Int, tag: String, serial_number: String, name: String, description: String, purchase_date: String, purchase_cost: Float, latest_value: Float, status: AssetStatus): FixedAsset!
    updateAssetCategory(id: Int, company_id: Int, branch_id: Int, vendor_id: Int, location_id: Int, category_id: Int, tag: String, serial_number: String, name: String, description: String, purchase_date: String, purchase_cost: Float, latest_value: Float, status: AssetStatus): FixedAsset!
    deleteAssetItem(company_id: Int, id: Int): Int #returns deleted asset item id
    

}

type JWT {
    accessToken: String!
    refreshToken: String!
  }

  type User {
    id: Int
    title: String
    firstname: String!
    lastname: String!
    email: String!
    phone: String
    date_of_birth: String
    gender: String!
    data: JSON
    settings: JSON
    created_at: Int
}
type UserBasic {
    id: Int
    title: String
    firstname: String!
    lastname: String!
    email: String!
    phone: String
}

type Company {
    id: Int
    name: String
    about: String
    address: String
    city: String
    state: String
    country: String
    phone: String
    email: String
    website: String
    industry: String
    logo: String
    settings: JSON
    plan: String
    plan_expiry: String
    created_at: Int
    updated_at: Int
}
type CompanyBasic {
    id: Int
    name: String
    about: String
    address: String
    city: String
    state: String
    country: String
    phone: String
    email: String
    website: String
    logo: String
}

type Branch {
    id: Int
    name: String
    settings: JSON
}

type Role {
    id: Int
    name: String
    json: JSON
    status: String
}

type Account {
    id: Int
    company_id: Int
    branch_id: Int
    details: JSON
    type: AccountTypes,
    category: AccountCategoryTypes
    balance: Float
    created_at: String
    updated_at: String
}

type LedgerDetails {
    name: String
    description: String
}

type CustomerDetails {
    name: String
    phone: String
    email: String
    description: String
}

type VendorDetails {
    name: String
    description: String
    address: String
    city: String
    state: String
    country: String
    phone: String
    email: String
    website: String
    bank_name: String
    bank_account_name: String
    bank_account_number: String
}

type EmployeeDetails {
    employee_id: String
    job_title_id: Int
    department_id: Int
    salary_id: Int
    manager_id: Int
    firstname: String
    middlename: String
    lastname: String
    photo_url: String
    gender: String
    nationality: String
    email: String
    phone: String
    bank_name: String
    bank_account_name: String
    bank_account_number: String
    gross_salary: Float
    loan_repayment: Float
    penalties: Float
    union_dues: Float
    health: Float
    retirements: Float
    other_deductions: Float
    income_tax: Float
    date_of_hire: String
    address: String
    city: String
    state: String
    country: String
    next_of_kin_name: String
    next_of_kin_phone: String
    next_of_kin_address: String
    next_of_kin_relationship: String
    next_of_kin_email: String
    next_of_kin_gender: String
    next_of_kin_occupation: String
    date_of_birth: String
    emergency_contact: String
    employment_type: String #Permanent, Contract, Internship
    leave_balance: String
}

enum AccountTypes {
    ASSET
    LIABILITY
    EQUITY
    INCOME
    EXPENSE
}
enum AccountCategoryTypes {
    LEDGER
    CUSTOMER
    EMPLOYEE
    VENDOR
}

type AccountingYear {
    id: Int
    company_id: Int
    name: String
    start_date: String
    end_date: String
    status: AccountingYearStatus
    created_at: String
    updated_at: String
}

enum AccountingYearStatus {
    ACTIVE
    PENDING
    CLOSED
}

type Transaction {
    id: Int
    company_id: Int
    branch_id: Int
    account_id: Int
    accounting_year_id: Int
    code: String
    amount: Float
    value_date: String
    remarks: String
    counterpart: String
    created_at: String
}

type TransactionComponent {
    account_id: Int
    amount: Float
}

type Department {
    id: Int
    name: String
    description: String
    created_at: String
    updated_at: String
}

type JobTitle {
    id: Int
    name: String
    description: String
    created_at: String
    updated_at: String
}

enum QualificationTypes {
  EXPERIENCE
  EDUCATION
  CERTIFICATION
  OTHERS
}

type Qualification {
    id: Int
    company_id: Int
    employee_id: Int
    type: QualificationTypes
    description: String
    date_obtained: String
    created_at: String
    updated_at: String
}

type PerformanceReview {
    id: Int
    company_id: Int
    employee_id: Int
    reviewer_id: Int
    review_date: String
    rating: Int
    comments: String
    created_at: String
    updated_at: String
}

type SalarySchedule {
    employee_id: Int
    employee_name: String
    employee_bank_details: String
    gross_pay: Float
    loan_repayment: Float
    penalties: Float
    union_dues: Float
    health: Float
    retirements: Float
    other_deductions: Float
    income_tax: Float
    net_pay: Float
}

type Payroll {
    id: Int
    company_id: Int
    branch_id: Int
    name: String
    code: String
    schedule: [SalarySchedule]
    salaries_total: Float
    tax_total: Float
    salaries_liabilities_posted: Int
    salaries_expenses_posted: Int
    loan_liabilities_posted: Int
    loan_expenses_posted: Int
    penalties_liabilities_posted: Int
    penalties_expenses_posted: Int
    union_dues_liabilities_posted: Int
    union_dues_expenses_posted: Int
    health_liabilities_posted: Int
    health_expenses_posted: Int
    retirements_liabilities_posted: Int
    retirements_expenses_posted: Int
    other_deductions_liabilities_posted: Int
    other_deductions_expenses_posted: Int
    tax_liabilities_posted: Int
    tax_expenses_posted: Int
    created_at: String
    updated_at: String
}

type AssetCategory {
    id: Int
    company_id: Int
    name: String
    description: String
    depreciation_method: String
    useful_life_years: Float
    salvage_value: Float
    created_at: String
    updated_at: String
}

type FixedAsset {
    id: Int
    company_id: Int
    branch_id: Int
    vendor_id: Int
    location_id: Int
    category_id: Int
    tag: String
    serial_number: String
    name: String
    description: String
    purchase_date: String
    purchase_cost: Float
    latest_value: Float
    status: AssetStatus
    created_at: String
    updated_at: String
}

enum AssetStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
  DAMAGED
  DISPOSED
}

type AssetDepreciation {
    id: Int
    company_id: Int
    item_id: Int
    tx_code: String
    depreciation_method: DepreciationMethod
    depreciation_amount: Float
    created_at: String
}

enum DepreciationMethod {
  STRAIGHT-LINE
  DECLINING-BALANCE
  SUM-OF-YEARS-DIGITS
  UNITS-OF-PRODUCTION
`;
