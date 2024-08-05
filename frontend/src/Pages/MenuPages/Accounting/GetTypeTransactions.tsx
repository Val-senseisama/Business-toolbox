import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import { PAGETITLE } from '../../../Components/Typography';
import { APIResponse } from '../../../Helpers/General';
import Session from '../../../Helpers/Session';
import { GET_TYPE_TRANSACTIONS } from '../../../GraphQL/Queries';
import { useQuery } from '@apollo/client';

const GetTypeTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [typeTransactionSearchData, setTypeTransactionSearchData] = useState({
    companyId: "",
    offset: "",
    branch_id: "",
    accounting_year_id: "",
    type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTypeTransactionSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    Session.remove("alerts");
  };

  const {
    loading,
    data: typeTransactionsData,
    refetch: codeTransactions,
  } = useQuery(GET_TYPE_TRANSACTIONS, {
    onCompleted: () => {
      setIsLoading(false);
      if (typeTransactionsData?.typeTransactions) {
        Session.saveAlert("type Transactions fetched sucessfully", "success");
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
    codeTransactions({ variables: { ...typeTransactionSearchData } });
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
              value={typeTransactionSearchData.companyId}
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
              value={typeTransactionSearchData.offset}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "offset" },
                })
              }
            />
            <label>Branch ID</label>
            <INPUT
              type="text"
              name="branch_id"
              id="branch_id"
              value={typeTransactionSearchData.branch_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "branch_id" },
                })
              }
            />
            <label>Accounting Year</label>
            <INPUT
              type="text"
              name="accounting_year"
              id="accounting_year"
              value={typeTransactionSearchData.accounting_year_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "accounting_year" },
                })
              }
            />
            <label>Type</label>
            <INPUT
              type="text"
              name="type"
              id="type"
              value={typeTransactionSearchData.type}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "type" },
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

export default GetTypeTransactions