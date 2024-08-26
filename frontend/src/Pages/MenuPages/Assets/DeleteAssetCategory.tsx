import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useMutation } from '@apollo/client';

import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';
import { DELETE_ASSET_CATEGORY } from '../../../GraphQL/Mutations';

const DeleteAssetCategory = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [deleteAssetCategoryData, setDeleteAssetCategoryData] = useState({
    deleteAssetCategoryId: "",
    companyId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeleteAssetCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    Session.remove("alerts");
  };

  const [deleteAssetCategory, { loading, error, data }] = useMutation(DELETE_ASSET_CATEGORY, {
    onCompleted: () => {
      setIsLoading(false);
      if (data?.deleteAssetCategory) {
        Session.saveAlert("Asset Category deleted sucessfully", "success");
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

  const deleteCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteAssetCategory({ variables: { ...deleteAssetCategoryData } });
  };

  return (
    <>
      <div className="container">
        <div className="d-flex flex-wrap align-content-center">
          <PAGETITLE>DELETE ASSET CATEGORY</PAGETITLE>
          <form onSubmit={deleteCategory}>
            <label>Asset Category ID</label>
            <INPUT
              type="text"
              name="deleteAssetCategoryId"
              id="deleteAssetCategoryId"
              value={deleteAssetCategoryData.deleteAssetCategoryId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "deleteAssetCategoryId" },
                })
              }
            />

            <label>Company ID</label>
            <INPUT
              type="text"
              name="companyId"
              id="companyId"
              value={deleteAssetCategoryData.companyId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "companyId" },
                })
              }
            />

            <BLOCKBUTTON type="submit" disabled={isLoading}>
              DELETE
            </BLOCKBUTTON>
          </form>
        </div>
      </div>
    </>
  );
}

export default DeleteAssetCategory;