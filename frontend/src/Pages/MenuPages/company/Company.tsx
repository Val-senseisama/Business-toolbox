import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_COMPANY } from '../../../GraphQL/Queries';
import { PAGETITLE } from '../../../Components/Typography';
import { BUTTON } from '../../../Components/Forms';
import { APIResponse, getUser } from '../../../Helpers/General';
import { DELETE_COMPANY } from '../../../GraphQL/Mutations';
import { Loading } from '../../../Components/Loading';

interface Company {
  id: number;
  name: string;
  about: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  accounting_year_id: number;
  website: string;
  logo: string;
}

const Companies = () => {
  const user = getUser();

  const { loading, error, data, refetch } = useQuery(GET_COMPANY, {
    fetchPolicy: 'network-only',
  });

  const [deleteCompany] = useMutation(DELETE_COMPANY);

  useEffect(() => {
    if (error) {
      APIResponse(error);
    }
  }, [error]);

  const navigate = useNavigate();
  const handleEdit = (id: number) => {
    navigate(`/update-company/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCompany({ variables: { id } });
      refetch();
    } catch (error) {
      console.log(error)
      // APIResponse(error);
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading companies</p>;

  return (
    <div className="container">
      <PAGETITLE>Companies</PAGETITLE>
      
      {data && data.getMyCompanies && (
        <>
          <table className='table table-stripped table-hover table-bordered'>
            <thead>
              <tr >
                <th>Logo</th>
                <th>Company ID</th>
                <th>Name</th>
                <th>About</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Accounting Year ID</th>
                <th>Website</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.getMyCompanies.map((company: Company) => (
                <tr key={company.id}>
                  <td>
                    <img src={company.logo} alt={company.name} style={{ width: '50px', height: '50px' }} />
                  </td>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>{company.about}</td>
                  <td>{company.address}</td>
                  <td>{company.city}</td>
                  <td>{company.state}</td>
                  <td>{company.country}</td>
                  <td>{company.phone}</td>
                  <td>{company.email}</td>
                  <td>{company.accounting_year_id}</td>
                  <td>{company.website}</td>
                  <td>
                    <BUTTON onClick={() => handleEdit(company.id)}>EDIT</BUTTON>
                    {/* <BUTTON onClick={() => handleDelete(company.id)}>Delete</BUTTON> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Companies;
