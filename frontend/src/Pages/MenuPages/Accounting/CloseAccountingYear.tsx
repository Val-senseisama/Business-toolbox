import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CLOSE_ACCOUNTING_YEAR } from "../../../GraphQL/Mutations";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";
import { BLOCKBUTTON } from "../../../Components/Forms";

interface CloseAccountingYearProps {
  accountingYear: {
    id: number;
    company_id: number;
    name: string;
  };
  show: boolean;
  onHide: () => void;
  onClosed: () => void;
}

const CloseAccountingYear: React.FC<CloseAccountingYearProps> = ({
  accountingYear,
  show,
  onHide,
  onClosed,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [closeAccountingYear] = useMutation(CLOSE_ACCOUNTING_YEAR, {
    onCompleted: (data) => {
      setIsLoading(false);
      if (data.closeAccountingYear) {
        Session.saveAlert("Accounting year closed successfully", "success");
        onClosed();
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
    closeAccountingYear({
      variables: {
        closeAccountingYearId: accountingYear.id,
        companyId: accountingYear.company_id,
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
            <h5 className="modal-title">Close Accounting Year</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p>
                Are you sure you want to close the accounting year "
                {accountingYear.name}"?
              </p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <BLOCKBUTTON
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
                disabled={isLoading}>
                Cancel
              </BLOCKBUTTON>
              <BLOCKBUTTON
                type="submit"
                className="btn btn-danger"
                disabled={isLoading}>
                {isLoading ? "Closing..." : "Close Accounting Year"}
              </BLOCKBUTTON>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CloseAccountingYear;
