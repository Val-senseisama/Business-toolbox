import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_JOB_TITLE } from '../../../../GraphQL/Queries';
import { PAGETITLE } from '../../../../Components/Typography';
import { BUTTON } from '../../../../Components/Forms';
import { APIResponse, getUser } from '../../../../Helpers/General';
import { DELETE_JOB_TITLE } from '../../../../GraphQL/Mutations';
import { Loading } from '../../../../Components/Loading';

interface JobTitle {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const JobTitles = () => {
  const [offset, setOffset] = useState(0);
  const user = getUser();
  const companyId = user.company_id;

  const { loading, error, data, fetchMore } = useQuery(GET_JOB_TITLE, {
    variables: { companyId, offset },
    fetchPolicy: 'network-only',
  });

  const [deleteJobTitle] = useMutation(DELETE_JOB_TITLE);

  useEffect(() => {
    if (error) {
      APIResponse(error);
    }
  }, [error]);

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data.getAllJobTitles.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getAllJobTitles: [...prev.getAllJobTitles, ...fetchMoreResult.getAllJobTitles],
        };
      },
    });
  };

  const navigate = useNavigate();
  const handleEdit = (id: number) => {
    navigate(`/edit-job-title/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteJobTitle({ variables: { id } });
    } catch (error) {
      // APIResponse(error);
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading job titles</p>;

  return (
    <div className="container">
      <PAGETITLE>Job Titles</PAGETITLE>
      
      {data && data.getAllJobTitles && (
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
              {data.getAllJobTitles.map((jobTitle: JobTitle) => (
                <tr key={jobTitle.id}>
                  <td>{jobTitle.id}</td>
                  <td>{jobTitle.name}</td>
                  <td>{jobTitle.description}</td>
                  <td>{jobTitle.created_at}</td>
                  <td>{jobTitle.updated_at}</td>
                  <td>
                    <BUTTON onClick={() => handleEdit(jobTitle.id)}>EDIT</BUTTON>
                    <BUTTON onClick={() => handleDelete(jobTitle.id)}>Delete</BUTTON>
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

export default JobTitles;
