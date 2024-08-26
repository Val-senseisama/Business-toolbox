// export default Dashboard;

import React from 'react'
import { Link } from 'react-router-dom'
import { PAGETITLE } from '../../Components/Typography'
import { BUTTON } from '../../Components/Forms'
const Dashboard = () => {

  return (
    <div className='container'>
       <PAGETITLE>WELCOME TO THE DASHBOARD</PAGETITLE>
        <div className='row m-2'>
        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label> Company</label>
              <div className='card-text'>
                Create Company
              </div>
              <Link to="/create-company">
                <BUTTON variant="primary">CREATE COMPANY</BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>View Company</label>
              <div className='card-text'>
           View All Companies
              </div>
              <Link to="/companies">
                <BUTTON variant="primary"> VIEW COMPANIES  </BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>Company Roles</label>
              <div className='card-text'>
             Create Company Roles
              </div>
              <Link to="/create-role">
                <BUTTON variant="primary"> CREATE COMPANY ROLES  </BUTTON>
              </Link>
            </div>  
          </div>
        </div>

 
      </div>
      <div className='row m-2'>
        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>Create Company Branch  </label>
              <div className='card-text'>
            Create Branch
              </div>
              <Link to="/create-branch">
                <BUTTON variant="primary"> CREATE COMPANY BRANCH  </BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>View Branch List</label>
              <div className='card-text'>
              Branch List
              </div>
              <Link to="/branch-list">
                <BUTTON variant="primary">COMPANY BRANCH </BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>Attendance</label>
              <div className='card-text'>
               List of all Attendance
              </div>
              <Link to="/attendance">
                <BUTTON variant="primary"> VIEW ATTENDANCE</BUTTON>
              </Link>
            </div>  
          </div>
        </div>
      </div>

      <div className='row m-2'>
        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>View Roles</label>
              <div className='card-text'>
             View All Roles
              </div>
              <Link to="/roles">
                <BUTTON variant="primary"> VIEW ROLES  </BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>Company Profile</label>
              <div className='card-text'>
                View Company Profile
              </div>
              <Link to="/company-profile">
                <BUTTON variant="primary">COMPANY PROFILE</BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>View Departments</label>
              <div className='card-text'>
               View All Departments
              </div>
              <Link to="/departments">
                <BUTTON variant="primary">VIEW DEPARTMENTS  </BUTTON>
              </Link>
            </div>  
          </div>
        </div>
      </div>

      <div className='row m-2'>
        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>Create Department</label>
              <div className='card-text'>
               Create a new Department
              </div>
              <Link to="/create-department">
                <BUTTON variant="primary"> CREATE DEPARTMENT  </BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>PROFILE</label>
              <div className='card-text'>
                Get student Profile
              </div>
              <Link to="/student">
                <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>PROFILE</label>
              <div className='card-text'>
                Get student Profile
              </div>
              <Link to="/student">
                <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
              </Link>
            </div>  
          </div>
        </div>
      </div>

      <div className='row m-2'>
        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>PROFILE</label>
              <div className='card-text'>
                Get student Profile
              </div>
              <Link to="/student">
                <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <label>PROFILE</label>
              <div className='card-text'>
                Get student Profile
              </div>
              <Link to="/student">
                <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
              </Link>
            </div>  
          </div>
        </div>

        <div className="col col-md-4">
          <div className='card'>
            <div className='card-body'>
             <PAGETITLE>PROFILE</PAGETITLE>
              <div className='card-text'>
                Get student Profile
              </div>
              <Link to="/student">
                <BUTTON variant="primary">STUDENT PROFILE</BUTTON>
              </Link>
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard