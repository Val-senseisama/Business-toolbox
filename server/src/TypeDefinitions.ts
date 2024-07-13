export default `#graphql

  scalar JSON
  
  type Query {
    #Phase 1
    currentUser: User!
    getConfig: JSON  
    getMyCompanies: [CompanyBasic!]
    getFullCompanyProfile(company_id: Int): Company!
    getUsersLinkedToMyCompany(company_id: Int): [UserBasic!]
    getAllCompanyBranches(company_id: Int): [Branch!]
    getAllCompanyUsers(company_id: Int): [UserBasic!]
    getAllCompanyRoles(company_id: Int): [Role!]
    getMyPendingCompanyLinks: [CompanyBasic!]


    #### Phase 2
    # Accounting
    getAllLedgers(company_id: Int): [Account!]
    getAllAccountingyears(company_id: Int): [AccountingYear!]
    getAlltransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, offset: Int): [Transaction!]
    getAccounttransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, account_id: Int, offset: Int): [Transaction!]
    getCodetransactions(company_id: Int, branch_id: Int, accounting_year_id: Int, code: Int, offset: Int): [Transaction!]
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

    createAccountingYear(company_id: Int, name: String, start_date: String, end_date: String): AccountingYear!
    updateAccountingYear(id: Int, company_id: Int, name: String, start_date: String, end_date: String): AccountingYear! #cant update a closed accounting year and cant update start_date for an active accounting year
    deleteAccountingYear(company_id: Int, id: Int): Int #returns deleted accounting year id, cant only delete a pending accounting year
    
    postTransaction( company_id: Int, branch_id: Int, source: [TransactionComponent!], destination: [TransactionComponent!], value_date: String, remarks: String): [Transaction!]
    deleteTransaction(company_id: Int, branch_id: Int, id: Int): String #returns deleted transaction code

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
    date_of_Birth: String
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
    description: JSON
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

`;
