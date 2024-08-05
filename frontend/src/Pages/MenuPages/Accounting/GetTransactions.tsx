import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { GET_ACCOUNT_TRANSACTIONS, GET_ALL_TRANSACTIONS } from '../../../GraphQL/Queries'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import { PAGETITLE } from '../../../Components/Typography';
import Session from '../../../Helpers/Session';
import { APIResponse } from '../../../Helpers/General';

const GetTransactions = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ searchData, setSearchData ] = useState({
    companyId: "",
    offset: "",
    branch_id: "",
    accounting_year:""
  })

  const [ accountTransactionSearchData, setAccountTransactionSearchData ] = useState({
    companyId: "",
    offset: "",
    branch_id: "",
    accounting_year: "",
    account_id: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [ name ]: value,
    }));
    Session.remove("alerts");
  };


  const {
    loading,
    data,
    refetch: Transactions,
  } = useQuery(GET_ALL_TRANSACTIONS, {
    onCompleted: () => {
      setIsLoading(false);
      if (data?.transactions) {
        Session.saveAlert("Transactions fetched sucessfully", "success");
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
  
  const { loading: transactionsLoading, data:accountTransactionsData, refetch: AccountTransactions } = useQuery(GET_ACCOUNT_TRANSACTIONS, {
    onCompleted: () => {
      setIsLoading(false);
      if (accountTransactionsData?.accountTransactions) {
        Session.saveAlert("Account Transactions fetched sucessfully", "success");
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
  })

  const getAllTransactions = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Transactions({ variables: { ...searchData } });
  }

  const getAccountTransactions = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Transactions({ variables: {...accountTransactionSearchData } });
  }


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
              value={searchData.companyId}
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
              value={searchData.offset}
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
              value={searchData.branch_id}
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
              value={searchData.accounting_year}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "accounting_year" },
                })
              }
            />
            <BLOCKBUTTON type="submit" disabled={isLoading}>
              SUBMIT
            </BLOCKBUTTON>
          </form>
        </div>

        <div className="d-flex align-items-center">
          <PAGETITLE>Account Transactions</PAGETITLE>
          <form onSubmit={getAccountTransactions}>
            <INPUT
              type="text"
              name="companyId"
              id="companyId"
              value={accountTransactionSearchData.companyId}
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
              value={accountTransactionSearchData.offset}
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
              value={accountTransactionSearchData.branch_id}
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
              value={accountTransactionSearchData.accounting_year}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "accounting_year" },
                })
              }
            />

            <label>Account ID</label>
            <INPUT
              type="text"
              name="account_id"
              id="account_id"
              value={accountTransactionSearchData.account_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "account_id"},
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

export default GetTransactions