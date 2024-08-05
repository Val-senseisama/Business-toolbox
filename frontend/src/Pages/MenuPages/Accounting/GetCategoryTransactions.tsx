import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { GET_CATEGORY_TRANSACTIONS } from '../../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetCategoryTransactions = () => {
   const [isLoading, setIsLoading] = useState(false);

   const [categoryTransactionSearchData, setCategoryTransactionSearchData] = useState({
     companyId: "",
     offset: "",
     branch_id: "",
     accounting_year_id: "",
     category: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setCategoryTransactionSearchData((prevData) => ({
       ...prevData,
       [name]: value,
     }));
     Session.remove("alerts");
   };

   const {
     loading,
     data: categoryTransactionsData,
     refetch: categoryTransactions,
   } = useQuery(GET_CATEGORY_TRANSACTIONS, {
     onCompleted: () => {
       setIsLoading(false);
       if (categoryTransactionsData?.categoryTransactions) {
         Session.saveAlert("category Transactions fetched sucessfully", "success");
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
     categoryTransactions({ variables: { ...categoryTransactionSearchData } });
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
               value={categoryTransactionSearchData.companyId}
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
               value={categoryTransactionSearchData.offset}
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
               value={categoryTransactionSearchData.branch_id}
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
               value={categoryTransactionSearchData.accounting_year_id}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                 handleChange({
                   ...e,
                   target: { ...e.target, name: "accounting_year" },
                 })
               }
             />
             <label>Category</label>
             <INPUT
               type="text"
               name="category"
               id="category"
               value={categoryTransactionSearchData.category}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                 handleChange({
                   ...e,
                   target: { ...e.target, name: "category" },
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

export default GetCategoryTransactions