import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';

import { CREATE_ASSET_ITEM } from '../../../GraphQL/Mutations';
import { Validate } from '../../../Helpers/Validate';
import Session from '../../../Helpers/Session';

const CreateAssetItem = () => {
  const [assetData, setAssetData] = useState({
    companyId: 0,
    branchId: 0,
    vendorId: 0,
    locationId: 0,
    categoryId: 0,
    tag: '',
    serialNumber: '',
    name: '',
    description: '',
    purchaseDate: '',
    purchaseCost: 0.0,
    latestValue: 0.0,
    status: 'Active',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  interface AssetItem {
    id: number;
    company_id: number;
    branch_id: number;
    vendor_id: number;
    location_id: number;
    category_id: number;
    tag: string;
    serial_number: string;
    name: string;
    description: string;
    purchase_date: string;
    purchase_cost: number;
    latest_value: number;
    status: string;
    created_at: string;
    updated_at: string;
  }

  const [createdItem, setCreatedItem] =
    useState<AssetItem | null>(null);

  const [CreateAssetItem] = useMutation(CREATE_ASSET_ITEM, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.createAssetItem) {
        setCreatedItem(data.createAssetItem);
        Session.saveAlert('Asset item created successfully', 'success');
        // navigate('/asset-items');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert('An error occurred. Please try again.', 'error');
      }
      Session.showAlert({});
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssetData((prevData) => ({
      ...prevData,
      [name]: name === 'purchaseCost' || name === 'latestValue' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasErrors = false;

    if (!Validate.string(assetData.name)) {
      Session.saveAlert('Please enter a valid asset item name.', 'error');
      hasErrors = true;
    }
    if (!Validate.string(assetData.description)) {
      Session.saveAlert('Please enter a valid asset item description.', 'error');
      hasErrors = true;
    }
    if (!Validate.date(assetData.purchaseDate)) {
      Session.saveAlert('Please enter a valid purchase date.', 'error');
      hasErrors = true;
    }
    if (!Validate.float(assetData.purchaseCost)) {
      Session.saveAlert('Please enter a valid purchase cost.', 'error');
      hasErrors = true;
    }
    if (!Validate.float(assetData.latestValue)) {
      Session.saveAlert('Please enter a valid latest value.', 'error');
      hasErrors = true;
    }

    if (hasErrors) {
      Session.showAlert({});
      return;
    }

    setIsLoading(true);
    CreateAssetItem({ variables: { ...assetData } });
  };

  return (
    <div className="container">
      <div className="w3-animate-left">
        <PAGETITLE>Create Asset Item</PAGETITLE>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <INPUT
            type="text"
            name="name"
            value={assetData.name}
            onChange={handleChange}
            placeholder="Enter asset item name"
          />
          <label>Description</label>
          <INPUT
            type="text"
            name="description"
            value={assetData.description}
            onChange={handleChange}
            placeholder="Enter asset item description"
          />
          <label>Purchase Date</label>
          <INPUT
            type="date"
            name="purchaseDate"
            value={assetData.purchaseDate}
            onChange={handleChange}
            placeholder="Enter purchase date"
          />
          <label>Purchase Cost</label>
          <INPUT
            type="number"
            name="purchaseCost"
            value={assetData.purchaseCost}
            onChange={handleChange}
            placeholder="Enter purchase cost"
          />
                  <label>Latest Value</label>
          <INPUT
            type="number"
            name="latestValue"
            value={assetData.latestValue}
            onChange={handleChange}
            placeholder="Enter latest value"
          />
          <label>Status</label>
          <INPUT
            type="text"
            name="status"
            value={assetData.status}
            onChange={handleChange}
            placeholder="Enter status"
          />
          <BLOCKBUTTON
            type="submit"
            className="w3-button w3-black w3-round"
          >
            Create Asset Item
          </BLOCKBUTTON>
        </form>
      </div>
    </div>  
  );
}

export default CreateAssetItem;