import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_DEPARTMENTS } from '../../../../GraphQL/Queries';
import { PAGETITLE } from '../../../../Components/Typography';
import { BUTTON } from '../../../../Components/Forms';
import { APIResponse, getUser } from '../../../../Helpers/General';
import { DELETE_DEPARTMENT } from '../../../../GraphQL/Mutations';
import { Loading } from '../../../../Components/Loading';

interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const Departments = () => {
  const [offset, setOffset] = useState(0);
  const [companyId, setCompanyId] = useState<number>(8);
  const user = getUser();
  // const companyId = user.company_id;

  const { loading, error, data, fetchMore } = useQuery(GET_DEPARTMENTS, {
    variables: { companyId, offset },
    fetchPolicy: 'network-only',
  });

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT);

  useEffect(() => {
    if (error) {
      // APIResponse(error);
      console.log(error)
    }
  }, [error]);

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data.getAllDepartments.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getAllDepartments: [...prev.getAllDepartments, ...fetchMoreResult.getAllDepartments],
        };
      },
    });
  };

  const navigate = useNavigate();
  const handleEdit = (id: number) => {
    navigate(`/update-department/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartment({ variables: { id } });
    } catch (error) {
      // APIResponse(error);
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading departments</p>;

  return (
    <div className="container">
      <PAGETITLE>Departments</PAGETITLE>
      {data && data.getAllDepartments && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.getAllDepartments.map((department: Department) => (
                <tr key={department.id}>
                  <td>{department.id}</td>
                  <td>{department.name}</td>
                  <td>{department.description}</td>
                  <td>{department.created_at}</td>
                  <td>{department.updated_at}</td>
                  <td>
                    <BUTTON onClick={() => handleEdit(department.id)}>EDIT</BUTTON>
                    <BUTTON onClick={() => handleDelete(department.id)}>Delete</BUTTON>
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

export default Departments;
