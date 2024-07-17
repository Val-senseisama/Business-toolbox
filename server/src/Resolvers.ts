import Department from "./Resolvers/Department"
import EmployeeQualifications from "./Resolvers/EmployeeQualifications"
import Employees from "./Resolvers/Employees"
import JobTitle from "./Resolvers/JobTitle"
import Performance from "./Resolvers/Performance"



export default {
  Query:{
    ...Department.Query,
    ...Employees.Query,
    ...JobTitle.Query,
    ...EmployeeQualifications.Query,
    ...Performance.Query


  },
  Mutation:{
    ...Department.Mutation,
    ...EmployeeQualifications.Mutation,
    ...Employees.Mutation,
    ...JobTitle.Mutation,
    ...Performance.Mutation,

  }
}