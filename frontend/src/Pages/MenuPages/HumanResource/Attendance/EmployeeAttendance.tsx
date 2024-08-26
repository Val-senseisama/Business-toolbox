import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_EMPLOYEE_ATTENDANCE } from '../../../../GraphQL/Queries';
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

const EmployeeAttendance = () => {
  const [offset, setOffset] = useState(0);
  const [attendanceDateStart, setAttendanceDateStart] = useState('');
  const [attendanceDateEnd, setAttendanceDateEnd] = useState('');
  const user = getUser();
  const companyId = user.company_id;
  const employeeId = user.employee_id; // Adjust this according to your app's logic

  const { loading, error, data, fetchMore } = useQuery(GET_EMPLOYEE_ATTENDANCE, {
    variables: { companyId, employeeId, attendanceDateStart, attendanceDateEnd, offset },
    fetchPolicy: 'network-only',
  });

//   const [deleteAttendance] = useMutation(DELETE_ATTENDANCE);

  useEffect(() => {
    if (error) {
      APIResponse(error);
    }
  }, [error]);

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data.getEmployeeAttendance.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getEmployeeAttendance: [...prev.getEmployeeAttendance, ...fetchMoreResult.getEmployeeAttendance],
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
      <PAGETITLE>Employee Attendance</PAGETITLE>
      
      {data && data.getEmployeeAttendance && (
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
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {data.getEmployeeAttendance.map((attendance: Attendance) => (
                <tr key={attendance.id}>
                  <td>{attendance.id}</td>
                  <td>{attendance.company_id}</td>
                  <td>{attendance.employee_id}</td>
                  <td>{attendance.date}</td>
                  <td>{attendance.time_in}</td>
                  <td>{attendance.time_out}</td>
                  <td>{attendance.created_at}</td>
                  <td>{attendance.updated_at}</td>
                  {/* <td>
                    <BUTTON onClick={() => handleEdit(attendance.id)}>EDIT</BUTTON>
                    <BUTTON onClick={() => handleDelete(attendance.id)}>Delete</BUTTON>
                  </td> */}
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

export default EmployeeAttendance;
