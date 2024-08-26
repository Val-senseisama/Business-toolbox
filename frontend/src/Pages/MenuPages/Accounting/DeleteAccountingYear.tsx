import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_ACCOUNTING_YEAR } from "../../../GraphQL/Mutations";
import { INPUT } from "../../../Components/Forms";


const DeleteAccountingYear = () => {
  const [companyId, setCompanyId] = useState("");
  const [accountingYearId, setAccountingYearId] = useState("");

  const [deleteAccountingYear, { loading, error }] = useMutation(
    DELETE_ACCOUNTING_YEAR,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deleteAccountingYear({
        variables: {
          companyId: parseInt(companyId),
          deleteAccountingYearId: parseInt(accountingYearId),
        },
      });
      alert("Accounting year deleted successfully");
      setCompanyId("");
      setAccountingYearId("");
    } catch (err) {
      console.error("Error deleting accounting year:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Delete Accounting Year</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="companyId">Company ID:</label>
          <INPUT
            type="number"
            id="companyId"
            value={companyId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="accountingYearId">Accounting Year ID:</label>
          <INPUT
            type="number"
            id="accountingYearId"
            value={accountingYearId}
            onChange={(e : React.ChangeEvent<HTMLInputElement>) => setAccountingYearId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Delete Accounting Year</button>
      </form>
    </div>
  );
};

export default DeleteAccountingYear;
