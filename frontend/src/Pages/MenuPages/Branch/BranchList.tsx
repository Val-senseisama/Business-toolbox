// import React, { useState, useEffect } from 'react'
// import { BLOCKBUTTON, INPUT, BUTTON } from '../../../Components/Forms'
// import { Link, useNavigate } from 'react-router-dom'
// import { Validate } from '../../../Helpers/Validate';
// import Session from '../../../Helpers/Session';
// import { PAGETITLE } from '../../../Components/Typography';
// import { useQuery } from '@apollo/client';
// import { APIResponse } from '../../../Helpers/General';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Loading } from '../../../Components/Loading';
// import { GET_COMPANY_BRANCHES } from '../../../GraphQL/Queries';

// const BranchList = () => {


//     const [branch, setBranch] = useState([]);

//     const { loading, error, data, refetch } = useQuery(GET_COMPANY_BRANCHES, {
//         fetchPolicy: 'cache-first',
//         onCompleted: (data) => {
//             setBranch({...data.getAllCompanyBranches})
//         },
//         onError: error => {
//             APIResponse(error);
//             if (Session.countAlert() < 1) {
//                 Session.saveAlert('GENERIC_ERROR', 'error');
//             }
//             Session.showAlert({});
//         }
//     });

//     if(loading){
//         return <Loading/>;
//     }
//   return (
//     <div>
//         <ToastContainer/>
 

//     </div>
//   )
// }

// export default BranchList

// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation } from '@apollo/client';
// import { useNavigate } from 'react-router-dom';
// import { GET_COMPANY_BRANCHES } from '../../../GraphQL/Queries';
// import { PAGETITLE } from '../../../Components/Typography';
// import { BUTTON } from '../../../Components/Forms';
// import { APIResponse, getUser } from '../../../Helpers/General';
// import { DELETE_COMPANY_BRANCH } from '../../../GraphQL/Mutations';
// import { Loading } from '../../../Components/Loading';
// import { ToastContainer } from 'react-toastify';

// interface CompanyBranch {
//   id: number;
//   name: string;
//   settings: any;
// }

// const BranchList = () => {
//   const [offset, setOffset] = useState(0);
//   const user = getUser();
//   const companyId = parseInt(user.company_id, 10);  // Ensure companyId is an integer


//   const { loading, error, data, fetchMore } = useQuery(GET_COMPANY_BRANCHES, {
//     variables: { companyId, offset },
//     fetchPolicy: 'network-only',
//   });

//   const [deleteBranch] = useMutation(DELETE_COMPANY_BRANCH);

//   useEffect(() => {
//     if (error) {
//       APIResponse(error);
//       console.log(error)
//     }
//   }, [error]);

//   const loadMore = () => {
//     fetchMore({
//       variables: {
//         offset: data.getAllCompanyBranches.length,
//       },
//       updateQuery: (prev, { fetchMoreResult }) => {
//         if (!fetchMoreResult) return prev;
//         return {
//           getAllCompanyBranches: [...prev.getAllCompanyBranches, ...fetchMoreResult.getAllCompanyBranches],
//         };
//       },
//     });
//   };

//   const navigate = useNavigate();
//   const handleEdit = (id: number) => {
//     navigate(`/update-branch/${id}`);
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteBranch({ variables: { id } });
//     } catch (error) {
//       console.log(error)
//       // APIResponse(error);
//     }
//   };

//   if (loading && !data) return <Loading />;
//   if (error) return <p>Error loading branches</p>;

//   return (
//     <div className="container">
//         <ToastContainer/>
//       <PAGETITLE>Company Branches</PAGETITLE>
      
//       {data && data.getAllCompanyBranches && (
//         <>
//           <table className='table table-stripped table-hover'>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Settings</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.getAllCompanyBranches.map((branch: CompanyBranch) => (
//                 <tr key={branch.id}>
//                   <td>{branch.id}</td>
//                   <td>{branch.name}</td>
//                   <td>{JSON.stringify(branch.settings)}</td>
//                   <td>
//                     <BUTTON onClick={() => handleEdit(branch.id)}>EDIT</BUTTON>
//                     <BUTTON onClick={() => handleDelete(branch.id)}>Delete</BUTTON>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {/* <BUTTON onClick={loadMore} className="mt-3">
//             Load More
//           </BUTTON> */}
          
//         </>
//       )}
//     </div>
//   );
// };

// export default BranchList;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_COMPANY_BRANCHES } from '../../../GraphQL/Queries';
import { PAGETITLE } from '../../../Components/Typography';
import { BUTTON } from '../../../Components/Forms';
import { APIResponse, getUser } from '../../../Helpers/General';
import { DELETE_COMPANY_BRANCH } from '../../../GraphQL/Mutations';
import { Loading } from '../../../Components/Loading';
import { ToastContainer, toast } from 'react-toastify';

interface CompanyBranch {
  id: number;
  name: string;
  settings: any;
}

interface GetAllCompanyBranchesData {
  getAllCompanyBranches: CompanyBranch[];
}

interface GetAllCompanyBranchesVars {
  companyId: number;
  offset: number;
}

const BranchList: React.FC = () => {
  const [offset, setOffset] = useState<number>(0);
  const [companyId, setCompanyId] = useState<number>(8);

  const user = getUser();
  // const companyId = user?.company_id ? parseInt(user.company_id, 10) : null;

  const { loading, error, data, fetchMore } = useQuery<GetAllCompanyBranchesData, GetAllCompanyBranchesVars>(
    GET_COMPANY_BRANCHES,
    {
      variables: { companyId: companyId || 0, offset },
      fetchPolicy: 'network-only',
      skip: !companyId,
    }
  );

  const [deleteBranch] = useMutation(DELETE_COMPANY_BRANCH);

  useEffect(() => {
    if (error) {
      if (error.message.includes('Invalid company')) {
        toast.error('Invalid company. Please check your company settings.');
      } else {
        // APIResponse(error);
      }
      console.error(error);
    }
  }, [error]);

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data?.getAllCompanyBranches.length || 0,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getAllCompanyBranches: [...prev.getAllCompanyBranches, ...fetchMoreResult.getAllCompanyBranches],
        };
      },
    });
  };

  const navigate = useNavigate();
  const handleEdit = (id: number) => {
    navigate(`/update-branch/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBranch({ variables: { id } });
      toast.success('Branch deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete branch');
    }
  };

  if (!companyId) return <p>Error: No company ID found. Please check your user settings.</p>;
  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading branches. Please try again later.</p>;

  return (
    <div className="container">
      <ToastContainer />
      <PAGETITLE>Company Branches</PAGETITLE>
      
      {data && data.getAllCompanyBranches && (
        <>
          <table className='table table-stripped table-hover'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Settings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.getAllCompanyBranches.map((branch: CompanyBranch) => (
                <tr key={branch.id}>
                  <td>{branch.id}</td>
                  <td>{branch.name}</td>
                  <td>{JSON.stringify(branch.settings)}</td>
                  <td>
                    <BUTTON onClick={() => handleEdit(branch.id)}>EDIT</BUTTON>
                    <BUTTON onClick={() => handleDelete(branch.id)}>Delete</BUTTON>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* <BUTTON onClick={loadMore} className="mt-3">
            Load More
          </BUTTON> */}
        </>
      )}
    </div>
  );
};

export default BranchList;