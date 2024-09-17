// export default Dashboard;
import { PAGETITLE } from '../../Components/Typography'

import Session from '../../Helpers/Session'
import Menu from '../../Components/Menu'
import { useQuery } from '@apollo/client'
import { GET_COMPANY } from '../../GraphQL/Queries'
import { APIResponse } from '../../Helpers/General'
import { Loading } from '../../Components/Loading'
import CompanyModule from '../../Components/CompanyModule'
import add from "../../assets/icons/add.png";
import TopBar from '../../Components/TopBar'
import ActivityModule from '../../Components/ActivityModule'
import user3 from '../../assets/icons/users3.png';
const Dashboard = () => {
 
  const user: Record<string, any> = JSON.parse(Session.getCookie("user"));
  
  const { data, loading } = useQuery(GET_COMPANY, {
    onCompleted: (data) => {
      Session.saveAlert("data Loaded successfully.", "success");
    },
    variables: {
      id: user.id
    },
    
    onError: (error) => {
      if (error.networkError) {
        Session.saveAlert(
          "Unable to connect to the server. Please check your internet connection and try again.",
          "error",
        );
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        APIResponse(error);
        if (Session.countAlert() < 1) {
          Session.saveAlert("An error occurred. Please try again.", "error");
        }
      } else {
        Session.saveAlert(
          "An unexpected error occurred. Please try again.",
          "error",
        );
      }
      Session.showAlert({});
    }
  });

  
 
  return (
    <div>
      {/* <Menu
        userName={user.firstname + "" + user.lastname}
        //count={0}
      > */}
      <TopBar />

      <div className="container d-flex flex-column justify-content-center vh-100">
        <PAGETITLE className="text-center fs-3 fw-bold">
          WELCOME TO THE DASHBOARD
        </PAGETITLE>
        <p className="text-center">
          Select a company to get started with your projects and works
        </p>
        {loading ? (
          <Loading />
        ) : (
          <div className="d-flex row mx-3">
            <CompanyModule
              id={data.getMyCompanies[0].id}
              name={data.getMyCompanies[0].name}
              src={data.getMyCompanies[0].logo}
            />

            <CompanyModule
              id={data.getMyCompanies[0].id}
              name={data.getMyCompanies[0].name}
              src={data.getMyCompanies[0].logo}
            />

            <CompanyModule
              id={data.getMyCompanies[0].id}
              name={data.getMyCompanies[0].name}
              src={data.getMyCompanies[0].logo}
            />
            <CompanyModule id={0} name={"Add a Company"} src={add} add={true} />

           
          </div>
        )}

        <>
          {/*           
          <div className="row m-2">
            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label> Company</label>
                  <div className="card-text">Create Company</div>
                  <Link to="/create-company">
                    <BUTTON variant="primary">CREATE COMPANY</BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>View Company</label>
                  <div className="card-text">View All Companies</div>
                  <Link to="/companies">
                    <BUTTON variant="primary"> VIEW COMPANIES </BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>Company Roles</label>
                  <div className="card-text">Create Company Roles</div>
                  <Link to="/create-role">
                    <BUTTON variant="primary"> CREATE COMPANY ROLES </BUTTON>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-2">
            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>Create Company Branch </label>
                  <div className="card-text">Create Branch</div>
                  <Link to="/create-branch">
                    <BUTTON variant="primary"> CREATE COMPANY BRANCH </BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>View Branch List</label>
                  <div className="card-text">Branch List</div>
                  <Link to="/branch-list">
                    <BUTTON variant="primary">COMPANY BRANCH </BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>Attendance</label>
                  <div className="card-text">List of all Attendance</div>
                  <Link to="/attendance">
                    <BUTTON variant="primary"> VIEW ATTENDANCE</BUTTON>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row m-2">
            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>View Roles</label>
                  <div className="card-text">View All Roles</div>
                  <Link to="/roles">
                    <BUTTON variant="primary"> VIEW ROLES </BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>Company Profile</label>
                  <div className="card-text">View Company Profile</div>
                  <Link to="/company-profile">
                    <BUTTON variant="primary">COMPANY PROFILE</BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>View Departments</label>
                  <div className="card-text">View All Departments</div>
                  <Link to="/departments">
                    <BUTTON variant="primary">VIEW DEPARTMENTS </BUTTON>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row m-2">
            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>Create Department</label>
                  <div className="card-text">Create a new Department</div>
                  <Link to="/create-department">
                    <BUTTON variant="primary"> CREATE DEPARTMENT </BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>PROFILE</label>
                  <div className="card-text">Get student Profile</div>
                  <Link to="/student">
                    <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>PROFILE</label>
                  <div className="card-text">Get student Profile</div>
                  <Link to="/student">
                    <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row m-2">
            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>PROFILE</label>
                  <div className="card-text">Get student Profile</div>
                  <Link to="/student">
                    <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <label>PROFILE</label>
                  <div className="card-text">Get student Profile</div>
                  <Link to="/student">
                    <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col col-md-4">
              <div className="card">
                <div className="card-body">
                  <PAGETITLE>PROFILE</PAGETITLE>
                  <div className="card-text">Get student Profile</div>
                  <Link to="/student">
                    <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
                  </Link>
                </div>
              </div>
            </div>
          </div> */}
        </>
      </div>
      {/* </Menu> */}
    </div>
  );
}

export default Dashboard