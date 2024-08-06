import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMPANY_PROFILE } from '../../../GraphQL/Queries';
import { PAGETITLE } from '../../../Components/Typography';
import { Loading } from '../../../Components/Loading';
import { APIResponse, getUser } from '../../../Helpers/General';
import { IMAGE } from '../../../Components/Forms';

interface CompanyProfile {
  id: number;
  name: string;
  about: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
  logo: string;
  accounting_year_id: number;
  settings: any;
  plan: string;
  plan_expiry: string;
  created_at: string;
  updated_at: string;
}

const CompanyProfile = () => {
  const user = getUser();
  const [companyId, setCompanyId] = useState<number>(8);


  const { loading, error, data } = useQuery(GET_COMPANY_PROFILE, {
    variables: { companyId },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (error) {
      APIResponse(error);
    }
  }, [error]);

  if (loading) return <Loading />;
  if (error) return <p>Error loading company profile</p>;

  const profile: CompanyProfile = data.getFullCompanyProfile;

  return (
    <div className="container">
      <PAGETITLE>Company Profile</PAGETITLE>
      
      <div className="profile">
        <div className="logo">
          <IMAGE src={profile.logo} alt={`${profile.name} logo`} />
        </div>
        <h2>{profile.name}</h2>
        <p><strong>About:</strong> {profile.about}</p>
        <p><strong>Address:</strong> {profile.address}, {profile.city}, {profile.state}, {profile.country}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Website:</strong> <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></p>
        <p><strong>Industry:</strong> {profile.industry}</p>
        <p><strong>Accounting Year ID:</strong> {profile.accounting_year_id}</p>
        <p><strong>Settings:</strong> {JSON.stringify(profile.settings)}</p>
        <p><strong>Plan:</strong> {profile.plan}</p>
        <p><strong>Plan Expiry:</strong> {profile.plan_expiry}</p>
        {/* <p><strong>Created At:</strong> {profile.created_at}</p> */}
        {/* <p><strong>Updated At:</strong> {profile.updated_at}</p> */}
      </div>
    </div>
  );
};

export default CompanyProfile;
