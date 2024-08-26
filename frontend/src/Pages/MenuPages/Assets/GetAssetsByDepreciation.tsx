import React, { useState } from 'react';
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useQuery } from '@apollo/client';
import { GET_ASSETS_DEPRECIATION } from '../../../GraphQL/Queries';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetAssetsDepreciation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [depreciationSearchData, setDepreciationSearchData] = useState({
    companyId: "",
    offset: "",
    assetId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDepreciationSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    Session.remove("alerts");
  };

  const {
    loading,
    data: depreciationData,
    refetch: getDepreciation,
  } = useQuery(GET_ASSETS_DEPRECIATION, {
    onCompleted: () => {
      setIsLoading(false);
      if (depreciationData?.getAssetsDepreciation) {
        Session.saveAlert("Depreciation data fetched successfully", "success");
      }
    },
    onError: (error) => {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        APIResponse(error);
        if (Session.countAlert() < 1) {
          Session.saveAlert("An error occurred. Please try again.", "error");
        }
      } else {
        Session.saveAlert(
          "An unexpected error occurred. Please try again.",
          "error",
        );
      }
      Session.showAlert({});
    },
  });

  const getDepreciationData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getDepreciation({ variables: { ...depreciationSearchData } });
  };

  return (
    <>
      <div className="container">
        <div className="d-flex flex-wrap align-content-center">
          <PAGETITLE>GET ASSET DEPRECIATION DATA</PAGETITLE>
          <form onSubmit={getDepreciationData}>
            <label>Company ID</label>
            <INPUT
              type="text"
              name="companyId"
              id="companyId"
              value={depreciationSearchData.companyId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "companyId" },
                })
              }
            />

            <label>Offset</label>
            <INPUT
              type="text"
              name="offset"
              id="offset"
              value={depreciationSearchData.offset}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "offset" },
                })
              }
            />

            <label>Asset ID</label>
            <INPUT
              type="text"
              name="assetId"
              id="assetId"
              value={depreciationSearchData.assetId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "assetId" },
                })
              }
            />

            <BLOCKBUTTON type="submit" disabled={isLoading}>
              SUBMIT
            </BLOCKBUTTON>
          </form>
        </div>
      </div>
    </>
  );
};

export default GetAssetsDepreciation;