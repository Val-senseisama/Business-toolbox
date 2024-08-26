import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UPDATE_ASSET_CATEGORY } from '../../../GraphQL/Mutations';

interface UpdateAssetCategoryProps {
  companyId: number;
  categoryId: number;
  initialData: {
    name: string;
    description: string;
    depreciation_method: string;
    useful_life_years: number;
    salvage_value: number;
  };
}

const UpdateAssetCategory: React.FC<UpdateAssetCategoryProps> = ({ companyId, categoryId, initialData }) => {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [depreciationMethod, setDepreciationMethod] = useState(initialData.depreciation_method);
  const [usefulLifeYears, setUsefulLifeYears] = useState(initialData.useful_life_years);
  const [salvageValue, setSalvageValue] = useState(initialData.salvage_value);
  const [updatedCategory, setUpdatedCategory] = useState<any>(null);

  const [updateAssetCategory] = useMutation(UPDATE_ASSET_CATEGORY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await updateAssetCategory({
        variables: {
          updateAssetCategoryId: categoryId,
          companyId,
          name,
          description,
          depreciationMethod,
          usefulLifeYears: parseFloat(usefulLifeYears.toString()),
          salvageValue: parseFloat(salvageValue.toString()),
        },
      });
      setUpdatedCategory(data.updateAssetCategory);
      toast.success('Asset category updated successfully');
    } catch (error) {
      toast.error('Error updating asset category');
      console.error('Error updating asset category:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Update Asset Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="depreciationMethod" className="form-label">Depreciation Method</label>
          <input type="text" className="form-control" id="depreciationMethod" value={depreciationMethod} onChange={(e) => setDepreciationMethod(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="usefulLifeYears" className="form-label">Useful Life (Years)</label>
          <input type="number" className="form-control" id="usefulLifeYears" value={usefulLifeYears} onChange={(e) => setUsefulLifeYears(parseFloat(e.target.value))} required />
        </div>
        <div className="mb-3">
          <label htmlFor="salvageValue" className="form-label">Salvage Value</label>
          <input type="number" className="form-control" id="salvageValue" value={salvageValue} onChange={(e) => setSalvageValue(parseFloat(e.target.value))} required />
        </div>
        <button type="submit" className="btn btn-primary">Update Asset Category</button>
      </form>

      {updatedCategory && (
        <div className="mt-4">
          <h3>Updated Asset Category</h3>
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
                <td>{updatedCategory.id}</td>
                <td>{updatedCategory.name}</td>
                <td>{updatedCategory.description}</td>
                <td>{updatedCategory.depreciation_method}</td>
                <td>{updatedCategory.useful_life_years}</td>
                <td>{updatedCategory.salvage_value}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default UpdateAssetCategory;