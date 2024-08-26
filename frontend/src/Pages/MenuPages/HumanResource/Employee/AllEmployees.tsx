import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_EMPLOYEES } from '../../../../GraphQL/Queries';
import { PAGETITLE } from '../../../../Components/Typography';
import { BUTTON } from '../../../../Components/Forms';
import { APIResponse,getUser } from '../../../../Helpers/General';
import { DELETE_EMPLOYEE } from '../../../../GraphQL/Mutations';
import { Loading } from '../../../../Components/Loading';

interface Employee {
  id: number;
  company_id: number;
  branch_id: number;
  details: any;
  type: string;
  category: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

const Employees = () => {
  const [offset, setOffset] = useState(0);
  const user = getUser();
  const companyId = user.company_id;

  const { loading, error, data, fetchMore } = useQuery(GET_ALL_EMPLOYEES, {
    variables: { companyId, offset },
    fetchPolicy: 'network-only',
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  useEffect(() => {
    if (error) {
      APIResponse(error);
    }
  }, [error]);

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data.getAllEmployees.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getAllEmployees: [...prev.getAllEmployees, ...fetchMoreResult.getAllEmployees],
        };
      },
    });
  };

  const navigate = useNavigate();
  const handleEdit = (id: number) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee({ variables: { id } });
    } catch (error) {
      // APIResponse(error);
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading employees</p>;

  return (
    <div className="container">
      <PAGETITLE>Employees</PAGETITLE>
      
      {data && data.getAllEmployees && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Company ID</th>
                <th>Branch ID</th>
                <th>Details</th>
                <th>Type</th>
                <th>Category</th>
                <th>Balance</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.getAllEmployees.map((employee: Employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.company_id}</td>
                  <td>{employee.branch_id}</td>
                  <td>{JSON.stringify(employee.details)}</td>
                  <td>{employee.type}</td>
                  <td>{employee.category}</td>
                  <td>{employee.balance}</td>
                  <td>{employee.created_at}</td>
                  <td>{employee.updated_at}</td>
                  <td>
                    <BUTTON onClick={() => handleEdit(employee.id)}>EDIT</BUTTON>
                    <BUTTON onClick={() => handleDelete(employee.id)}>Delete</BUTTON>
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

export default Employees;
