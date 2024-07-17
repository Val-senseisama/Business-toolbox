import Department from "./Resolvers/hr/Department"
import EmployeeQualifications from "./Resolvers/hr/EmployeeQualifications"
import Employees from "./Resolvers/hr/Employees"
import JobTitle from "./Resolvers/hr/JobTitle"
import Performance from "./Resolvers/hr/Performance"



export default {
  Query: {
    ...Department.Query,
    ...Employees.Query,
    ...JobTitle.Query,
    ...EmployeeQualifications.Query,
    ...Performance.Query


  },
  Mutation: {
    ...Department.Mutation,
    ...EmployeeQualifications.Mutation,
    ...Employees.Mutation,
    ...JobTitle.Mutation,
    ...Performance.Mutation,

  }
}