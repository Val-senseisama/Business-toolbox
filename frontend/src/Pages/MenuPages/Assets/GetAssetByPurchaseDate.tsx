import React, { useState } from 'react';
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useQuery } from '@apollo/client';
import { GET_ASSETS_BY_PURCHASE_DATE } from '../../../GraphQL/Queries';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetAssetsByPurchaseDate = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [assetSearchData, setAssetSearchData] = useState({
    companyId: "",
    purchaseDateStart: "",
    purchaseDateEnd: "",
    status: "",
    offset: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssetSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    Session.remove("alerts");
  };

  const {
    loading,
    data: assetData,
    refetch: assets,
  } = useQuery(GET_ASSETS_BY_PURCHASE_DATE, {
    onCompleted: () => {
      setIsLoading(false);
      if (assetData?.getAssetsByPurchaseDate) {
        Session.saveAlert("Assets fetched successfully", "success");
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
          "error"
        );
      }
      Session.showAlert({});
    },
  });

  const getAllAssets = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    assets({ variables: { ...assetSearchData } });
  };

  return (
    <>
      <div className="container">
        <div className="d-flex flex-wrap align-content-center">
          <PAGETITLE>GET ASSETS BY PURCHASE DATE</PAGETITLE>
          <form onSubmit={getAllAssets}>
            <label>Company ID</label>
            <INPUT
              type="text"
              name="companyId"
              id="companyId"
              value={assetSearchData.companyId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "companyId" },
                })
              }
            />

            <label>Purchase Date Start</label>
            <INPUT
              type="text"
              name="purchaseDateStart"
              id="purchaseDateStart"
              value={assetSearchData.purchaseDateStart}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "purchaseDateStart" },
                })
              }
            />

            <label>Purchase Date End</label>
            <INPUT
              type="text"
              name="purchaseDateEnd"
              id="purchaseDateEnd"
              value={assetSearchData.purchaseDateEnd}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "purchaseDateEnd" },
                })
              }
            />

            <label>Status</label>
            <INPUT
              type="text"
              name="status"
              id="status"
              value={assetSearchData.status}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "status" },
                })
              }
                      />
      
                      <label>Offset</label>
                      <INPUT
                       type="text"
              name="offset"
              id="offset"
              value={assetSearchData.offset}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "offset" },
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
export default GetAssetsByPurchaseDate