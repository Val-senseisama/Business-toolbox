import  { useState, useEffect } from 'react';
import { useQuery} from '@apollo/client';
import {  useParams } from 'react-router-dom';
import { GET_COMPANY } from '../../../GraphQL/Queries';
import { PAGETITLE } from '../../../Components/Typography';
import { APIResponse } from '../../../Helpers/General';
import { Loading } from '../../../Components/Loading';
import TopBar from '../../../Components/TopBar';
import ActivityModule from '../../../Components/ActivityModule';
import group from '../../../assets/icons/group.png';
import messages from "../../../assets/icons/message.png";
import crm from "../../../assets/icons/crm.png";
import books from "../../../assets/icons/books.png";
import repo from "../../../assets/icons/file.png";
import projects from "../../../assets/icons/proj.png";
import fdesk from "../../../assets/icons/fdesk.png";
import ra from "../../../assets/icons/riskassessment.png";

const Companies = () => {
  const companyId = useParams().id as string;
  const id= parseInt(companyId)
  
  const { loading, error, data } = useQuery(GET_COMPANY, {
    fetchPolicy: 'network-only',
  });

  const [ offset, setOffset ] = useState(0)
  
  useEffect(() => {
    if (error) {
      APIResponse(error);
    }
  }, [error]);



  if (loading && !data) return <Loading />;
  if (error) return <p>Error loading companies</p>;

  return (
    <>
      <TopBar />
      <div className="container-fluid-lg mx-5 d-flex flex-column justify-content-center vh-100">
        <PAGETITLE className=" fs-3 fw-bold">Accessible Modules</PAGETITLE>
        <p>
          Select a company to get started with your projects and works
        </p>
        {loading ? (
          <Loading />
        ) : (
          <div className="row mt-5">
            <ActivityModule
            companyId={id}
              module="human-resources"
              name="Human Resources"
              src={group}
              text="Innovative Approaches to Human Resource Management"
            />

            <ActivityModule
            companyId={id}
              module="messages"
              name="Messages"
              src={messages}
              text="Seamless Communication at Your Fingertips"
            />

            <ActivityModule
            companyId={id}
              module="crm"
              name="C.R.M"
              src={crm}
              text="Innovative CRM Solutions for Business Growth"
            />

            <ActivityModule
            companyId={id}
              module="books"
              name="Books"
              src={books}
              text="Streamlined Accounting Solutions"
            />

            <ActivityModule
            companyId={id}
              module="repository"
              name="Repository"
              src={repo}
              text="Efficient Information Management"
            />

            <ActivityModule
            companyId={id}
              module="projects"
              name="Projects"
              src={projects}
              text="Revolutionize Your Project Workflow"
            />

            <ActivityModule
            companyId={id}
              module="frontdesk"
              name="Frontdesk"
              src={fdesk}
              text="Revolutionize Your Project Workflow"
            />
            <ActivityModule
            companyId={id}
              module="risk-assessment"
              name="Risk Assessment"
              src={ra}
              text="Identify and Mitigate Risks Effectively"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Companies;
