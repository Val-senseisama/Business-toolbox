import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  GET_ACCOUNT_TRANSACTIONS,
  GET_ALL_TRANSACTIONS,
  GET_CODE_TRANSACTIONS,
} from "../../../GraphQL/Queries";
import { BLOCKBUTTON, INPUT } from "../../../Components/Forms";
import { PAGETITLE } from "../../../Components/Typography";
import Session from "../../../Helpers/Session";
import { APIResponse } from "../../../Helpers/General";

const GetCodeTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  

  const [codeTransactionSearchData, setcodeTransactionSearchData] =
    useState({
      companyId: "",
      offset: "",
      branch_id: "",
      accounting_year_id: "",
      code: "",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setcodeTransactionSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    Session.remove("alerts");
  };

  const {
    loading,
    data: codeTransactionsData,
    refetch: codeTransactions,
  } = useQuery(GET_CODE_TRANSACTIONS, {
    onCompleted: () => {
      setIsLoading(false);
      if (codeTransactionsData?.codeTransactions) {
        Session.saveAlert(
          "code Transactions fetched sucessfully",
          "success",
        );
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
    codeTransactions({ variables: { ...codeTransactionSearchData } });
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
              value={codeTransactionSearchData.companyId}
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
              value={codeTransactionSearchData.offset}
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
              value={codeTransactionSearchData.branch_id}
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
              value={codeTransactionSearchData.accounting_year_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "accounting_year" },
                })
              }
                      />
            <label>Code</label>
            <INPUT
              type="text"
              name="code"
              id="code"
              value={codeTransactionSearchData.code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "code" },
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
export default GetCodeTransactions
