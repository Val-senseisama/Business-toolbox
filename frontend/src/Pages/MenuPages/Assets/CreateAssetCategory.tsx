import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';




import { useMutation } from '@apollo/client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CREATE_ASSET_CATEGORY } from '../../../GraphQL/Mutations';
import Session from '../../../Helpers/Session';
import { APIResponse } from '../../../Helpers/General';
import { Validate } from '../../../Helpers/Validate';
import { PAGETITLE } from '../../../Components/Typography';
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';

const CreateAssetCategory = () => {
  const [categoryData, setCategoryData] = useState({
    companyId: 0,
    name: '',
    description: '',
    depreciationMethod: '',
    usefulLifeYears: 0,
    salvageValue: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


 interface AssetCategory {
   id: number;
   name: string;
   description: string;
   depreciation_method: string;
   useful_life_years: number;
   salvage_value: number;
 }
 
      const [createdCategory, setCreatedCategory] =
        useState<AssetCategory | null>(null);
    
  const [CreateAssetCategory] = useMutation(CREATE_ASSET_CATEGORY, {
onCompleted: (data) => {
  setIsLoading(false);
  if (data.createAssetCategory) {
    setCreatedCategory(data.createAssetCategory);
    Session.saveAlert('Asset category created successfully', 'success');
    // navigate('/asset-categories');
  }
},
    onError: (error) => {
      setIsLoading(false);
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert('An error occurred. Please try again.', 'error');
      }
      Session.showAlert({});
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: name === 'usefulLifeYears' || name === 'salvageValue' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasErrors = false;

    if (!Validate.string(categoryData.name)) {
      Session.saveAlert('Please enter a valid category name.', 'error');
      hasErrors = true;
    }
    if (!Validate.string(categoryData.depreciationMethod)) {
      Session.saveAlert('Please enter a valid depreciation method.', 'error');
      hasErrors = true;
    }
    if (!Validate.integer(categoryData.usefulLifeYears)) {
      Session.saveAlert('Please enter a valid useful life in years.', 'error');
      hasErrors = true;
    }
    if (!Validate.integer(categoryData.salvageValue)) {
      Session.saveAlert('Please enter a valid salvage value.', 'error');
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    setIsLoading(true);
    CreateAssetCategory({ variables: { ...categoryData } });
  };

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Create Asset Category</PAGETITLE>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <INPUT
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            placeholder="Enter category name"
          />
          <label>Description</label>
          <INPUT
            type="text"
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            placeholder="Enter category description"
          />
          <label>Depreciation Method</label>
          <INPUT
            type="text"
            name="depreciationMethod"
            value={categoryData.depreciationMethod}
            onChange={handleChange}
            placeholder="Enter depreciation method"
          />
          <label>Useful Life (Years)</label>
          <INPUT
            type="number"
            name="usefulLifeYears"
            value={categoryData.usefulLifeYears}
            onChange={handleChange}
            placeholder="Enter useful life in years"
          />
          <label>Salvage Value</label>
          <INPUT
            type="number"
            name="salvageValue"
            value={categoryData.salvageValue}
            onChange={handleChange}
            placeholder="Enter salvage value"
          />
          <BLOCKBUTTON
            type="submit"
            className={isLoading ? "inactive-primary" : "primary"}
            disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Asset Category"}
          </BLOCKBUTTON>
        </form>

        {createdCategory && (
          <div className="mt-4">
            <h3>Created Asset Category</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Depreciation Method</th>
                  <th>Useful Life (Years)</th>
                  <th>Salvage Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{createdCategory?.id}</td>
                  <td>{createdCategory?.name}</td>
                  <td>{createdCategory?.description}</td>
                  <td>{createdCategory?.depreciation_method}</td>
                  <td>{createdCategory?.useful_life_years}</td>
                  <td>{createdCategory?.salvage_value}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateAssetCategory;