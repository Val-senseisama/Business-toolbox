import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ACCOUNTING_YEAR } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";

interface CreateAccountingYearProps {
  companyId: number;
  show: boolean;
  onHide: () => void;
  onCreated: () => void;
}

const CreateAccountingYear: React.FC<CreateAccountingYearProps> = ({
  companyId,
  show,
  onHide,
  onCreated,
}) => {
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [createAccountingYear] = useMutation(CREATE_ACCOUNTING_YEAR, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.createAccountingYear) {
        Session.saveAlert("Accounting year created successfully", "success");
        onCreated();
        onHide();
        resetForm();
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
    createAccountingYear({
      variables: {
        companyId,
        name,
        startDate,
        endDate,
      },
    });
  };

  const resetForm = () => {
    setName("");
    setStartDate("");
    setEndDate("");
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
            <h5 className="modal-title">Create Accounting Year</h5>
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
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountingYear;
