import Department from "./Resolvers/hr/Department"
import EmployeeQualifications from "./Resolvers/hr/EmployeeQualifications"
import Employees from "./Resolvers/hr/Employees"
import JobTitle from "./Resolvers/hr/JobTitle"
import Performance from "./Resolvers/hr/Performance"
import Company from "./Resolvers/auth/Company.js"
import Roles from "./Resolvers/auth/Roles.js"
import User from "./Resolvers/auth/User.js"




export default {
  Query: {
    ...Department.Query,
    ...Employees.Query,
    ...JobTitle.Query,
    ...EmployeeQualifications.Query,
    ...Performance.Query,
    ...Company.Query,
    ...User.Query,
    ...Roles.Query,


  },
  Mutation: {
    ...Department.Mutation,
    ...EmployeeQualifications.Mutation,
    ...Employees.Mutation,
    ...JobTitle.Mutation,
    ...Performance.Mutation,
    ...Company.Mutation,
    ...User.Mutation,
    ...Roles.Mutation

  }
}