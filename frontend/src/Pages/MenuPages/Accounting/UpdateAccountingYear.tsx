import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_ACCOUNTING_YEAR } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";

interface UpdateAccountingYearProps {
  accountingYear: {
    id: number;
    company_id: number;
    name: string;
    start_date: string;
    end_date: string;
  };
  show: boolean;
  onHide: () => void;
  onUpdated: () => void;
}

const UpdateAccountingYear: React.FC<UpdateAccountingYearProps> = ({
  accountingYear,
  show,
  onHide,
  onUpdated,
}) => {
  const [name, setName] = useState<string>(accountingYear.name);
  const [startDate, setStartDate] = useState<string>(accountingYear.start_date);
  const [endDate, setEndDate] = useState<string>(accountingYear.end_date);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setName(accountingYear.name);
    setStartDate(accountingYear.start_date);
    setEndDate(accountingYear.end_date);
  }, [accountingYear]);

  const [updateAccountingYear] = useMutation(UPDATE_ACCOUNTING_YEAR, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.updateAccountingYear) {
        Session.saveAlert("Accounting year updated successfully", "success");
        onUpdated();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    updateAccountingYear({
      variables: {
        updateAccountingYearId: accountingYear.id,
        companyId: accountingYear.company_id,
        name,
        startDate,
        endDate,
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
            <h5 className="modal-title">Update Accounting Year</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
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
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountingYear;
