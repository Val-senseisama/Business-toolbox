import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { APIResponse } from '../../../Helpers/General';
import { useQuery } from '@apollo/client';
import { GET_ASSET_CATEGORY } from '../../../GraphQL/Queries';
import { PAGETITLE } from '../../../Components/Typography';

const GetAssetCategory = () => {
   const [isLoading, setIsLoading] = useState(false);

   const [assetCategorySearchData, setassetCategorySearchData] = useState({
     companyId: "",
     offset: "",
     status: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setassetCategorySearchData((prevData) => ({
       ...prevData,
       [name]: value,
     }));
     Session.remove("alerts");
   };

   const {
     loading,
     data: assetCategoryData,
     refetch: assetCategory,
   } = useQuery(GET_ASSET_CATEGORY, {
     onCompleted: () => {
       setIsLoading(false);
       if (assetCategoryData?.assetCategory) {
         Session.saveAlert("code Transactions fetched sucessfully", "success");
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
     assetCategory({ variables: { ...assetCategorySearchData } });
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
               value={assetCategorySearchData.companyId}
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
               value={assetCategorySearchData.offset}
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
               name="status"
               id="status"
               value={assetCategorySearchData.status}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                 handleChange({
                   ...e,
                   target: { ...e.target, name: "status" },
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

export default GetAssetCategory