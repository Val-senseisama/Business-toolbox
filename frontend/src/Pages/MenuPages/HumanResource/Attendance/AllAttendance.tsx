import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_ATTENDANCE } from '../../../../GraphQL/Queries';
import { PAGETITLE } from '../../../../Components/Typography';
import { BUTTON } from '../../../../Components/Forms';
import { APIResponse, getUser } from '../../../../Helpers/General';
// import { DELETE_ATTENDANCE } from '../../../../GraphQL/Mutations';
import { Loading } from '../../../../Components/Loading';

interface Attendance {
  id: number;
  company_id: number;
  employee_id: number;
  date: string;
  time_in: string;
  time_out: string;
  created_at: string;
  updated_at: string;
}

const Attendance = () => {
  const [offset, setOffset] = useState(0);
  const [attendanceDateStart, setAttendanceDateStart] = useState('');
  const [attendanceDateEnd, setAttendanceDateEnd] = useState('');
  const [companyId, setCompanyId] = useState<number>(8);

  const user = getUser();
  // const companyId = user.company_id;

  const { loading, error, data, fetchMore } = useQuery(GET_ALL_ATTENDANCE, {
    variables: { companyId, attendanceDateStart, attendanceDateEnd, offset },
    fetchPolicy: 'network-only',
  });

//   const [deleteAttendance] = useMutation(DELETE_ATTENDANCE);
useEffect(() => {
  if (error) {
    console.log(error)
    // APIResponse(error);
  }
}, [error]);

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data.getAllEmployeeAttendance.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getAllEmployeeAttendance: [...prev.getAllEmployeeAttendance, ...fetchMoreResult.getAllEmployeeAttendance],
        };
      },
    });
  };

  const navigate = useNavigate();
//   const handleEdit = (id: number) => {
//     navigate(`/edit-attendance/${id}`);
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteAttendance({ variables: { id } });
//     } catch (error) {
//       // APIResponse(error);
//     }
//   };

  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading attendance records</p>;

  return (
    <div className="container">
      <PAGETITLE>Attendance</PAGETITLE>
      
      {data && data.getAllEmployeeAttendance && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Company ID</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {data.getAllEmployeeAttendance.map((attendance: Attendance) => (
                <tr key={attendance.id}>
                  <td>{attendance.id}</td>
                  <td>{attendance.company_id}</td>
                  <td>{attendance.employee_id}</td>
                  <td>{attendance.date}</td>
                  <td>{attendance.time_in}</td>
                  <td>{attendance.time_out}</td>
                  <td>{attendance.created_at}</td>
                  <td>{attendance.updated_at}</td>
                  <td>
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

export default Attendance;
