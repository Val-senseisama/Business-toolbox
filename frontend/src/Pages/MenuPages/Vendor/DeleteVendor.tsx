import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_VENDOR } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";

interface DeleteVendorProps {
  vendorId: number;
  companyId: number;
  vendorName: string;
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
}

const DeleteVendor: React.FC<DeleteVendorProps> = ({
  vendorId,
  companyId,
  vendorName,
  show,
  onHide,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [deleteVendor] = useMutation(DELETE_VENDOR, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.deleteVendor) {
        Session.saveAlert("Vendor deleted successfully", "success");
        onDelete();
        onHide();
      }
    },
    onError: (error) => {
      setIsLoading(false);
      APIResponse(error);
      if (Session.countAlert() < 1) {
        Session.saveAlert("An error occurred. Please try again.", "error");
      }
      Session.showAlert({});
    },
  });

  const handleDelete = () => {
    setIsLoading(true);
    deleteVendor({
      variables: {
        companyId: companyId,
        deleteVendorId: vendorId,
      },
    });
  };

  if (!show) return null;

  return (
    <div
      className={`modal ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Vendor</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete the vendor "{vendorName}"?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
              disabled={isLoading}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteVendor;
