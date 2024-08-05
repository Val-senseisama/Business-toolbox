import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { GET_ASSET_ITEM } from '../../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetAssetItem = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [assetItemSearchData, setassetItemSearchData] = useState({
    companyId: "",
    offset: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setassetItemSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    Session.remove("alerts");
  };

  const {
    loading,
    data: assetItemsData,
    refetch: assetItems,
  } = useQuery(GET_ASSET_ITEM, {
    onCompleted: () => {
      setIsLoading(false);
      if (assetItemsData?.assetItems) {
        Session.saveAlert("code Transactions fetched sucessfully", "success");
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

  const getAllTransactions = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    assetItems({ variables: { ...assetItemSearchData } });
  };

  return (
    <>
      <div className="container">
        <div className="d-flex flex-wrap align-content-center">
          <PAGETITLE>GET ALL BRANCH TRANSACTIONS</PAGETITLE>
          <form onSubmit={getAllTransactions}>
            <label>Company ID</label>
            <INPUT
              type="text"
              name="companyId"
              id="companyId"
              value={assetItemSearchData.companyId}
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
              value={assetItemSearchData.offset}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "offset" },
                })
              }
            />
            <label>Status</label>
            <INPUT
              type="text"
              name="branch_id"
              id="branch_id"
              value={assetItemSearchData.status}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "status" },
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
}

export default GetAssetItem