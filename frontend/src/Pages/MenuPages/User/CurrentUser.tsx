import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../../../GraphQL/Queries';
import { PAGETITLE } from '../../../Components/Typography';
import { BUTTON } from '../../../Components/Forms';
import { APIResponse } from '../../../Helpers/General';
import { Loading } from '../../../Components/Loading';

interface User {
  id: number;
  title: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  data: any;
  settings: any;
  created_at: string;
}

const CurrentUser = () => {
  const { loading, error, data } = useQuery(CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (error) {
      APIResponse(error);
    }
  }, [error]);

  const navigate = useNavigate();
  const handleEdit = (id: number) => {
    navigate(`/edit-user/${id}`);
  };

  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading user information</p>;

  return (
    <div className="container">
      <PAGETITLE>Current User</PAGETITLE>
      
      {data && data.currentUser && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Data</th>
                <th>Settings</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.currentUser.id}</td>
                <td>{data.currentUser.title}</td>
                <td>{data.currentUser.firstname}</td>
                <td>{data.currentUser.lastname}</td>
                <td>{data.currentUser.email}</td>
                <td>{data.currentUser.phone}</td>
                <td>{data.currentUser.date_of_birth}</td>
                <td>{data.currentUser.gender}</td>
                <td>{JSON.stringify(data.currentUser.data)}</td>
                <td>{JSON.stringify(data.currentUser.settings)}</td>
                <td>{data.currentUser.created_at}</td>
                <td>
                  <BUTTON onClick={() => handleEdit(data.currentUser.id)}>EDIT</BUTTON>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CurrentUser;
