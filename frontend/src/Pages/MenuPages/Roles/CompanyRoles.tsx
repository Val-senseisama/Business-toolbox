import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { GET_COMPANY_ROLES } from '../../../GraphQL/Queries';
import { PAGETITLE } from '../../../Components/Typography';
import { BUTTON } from '../../../Components/Forms';
import { APIResponse, getUser } from '../../../Helpers/General';
import { DELETE_ROLE } from '../../../GraphQL/Mutations';
import { Loading } from '../../../Components/Loading';

interface CompanyRole {
    id: number;  
    name: string;
    json: any; 
    status: string;
  }

const CompanyRoles = () => {
  const [offset, setOffset] = useState(0);
  const [companyId, setCompanyId] = useState<number>(8);
  const user = getUser();
  // const companyId = user.company_id;
 

  const { loading, error, data, fetchMore } = useQuery(GET_COMPANY_ROLES, {
    variables: { companyId, offset },
    fetchPolicy: 'network-only',
  });

  const [deleteRole] = useMutation(DELETE_ROLE);

  useEffect(() => {
    if (error) {
      APIResponse(error);
      console.log(error)
    }
  }, [error]);

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data.getAllCompanyRoles.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getAllCompanyRoles: [...prev.getAllCompanyRoles, ...fetchMoreResult.getAllCompanyRoles],
        };
      },
    });
  };

  const navigate = useNavigate()
  const handleEdit = (id: number) => {
    navigate(`/update-role/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole({ variables: { id } });
    } catch (error) {
      console.log(error)
      // APIResponse(error);
      
    }
  };

  if (loading && !data) return <Loading/>;
  if (error) return <p>Error loading roles</p>;

  return (
    <div className="container">
      <PAGETITLE>Company Roles</PAGETITLE>
      
      {data && data.getAllCompanyRoles && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.getAllCompanyRoles.map((role: CompanyRole) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>{JSON.stringify(role.json)}</td>
                  <td>{role.status}</td>
                  <td>
                    <BUTTON onClick={() => handleEdit(role.id)}>EDIT</BUTTON>
                    <BUTTON onClick={() => handleDelete(role.id)}>Delete</BUTTON>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <BUTTON onClick={loadMore} className="mt-3">
            Load More
          </BUTTON>
          
        </>
      )}
    </div>
  );
};

export default CompanyRoles;
