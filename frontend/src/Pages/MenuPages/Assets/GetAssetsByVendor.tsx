import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useQuery } from '@apollo/client';
import { GET_ASSETS_BY_VENDOR } from '../../../GraphQL/Queries';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetAssetsByVendor = () => {
   const [isLoading, setIsLoading] = useState(false);

   const [vendorAssetSearchData, setvendorAssetSearchData] = useState({
     companyId: "",
     offset: "",
     vendorId: "",
     status: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setvendorAssetSearchData((prevData) => ({
       ...prevData,
       [name]: value,
     }));
     Session.remove("alerts");
   };

   const {
     loading,
     data: vendorAssetsData,
     refetch: vendorAssets,
   } = useQuery(GET_ASSETS_BY_VENDOR, {
     onCompleted: () => {
       setIsLoading(false);
       if (vendorAssetsData?.vendorAssets) {
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
     vendorAssets({ variables: { ...vendorAssetSearchData } });
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
               value={vendorAssetSearchData.companyId}
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
               value={vendorAssetSearchData.offset}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                 handleChange({
                   ...e,
                   target: { ...e.target, name: "offset" },
                 })
               }
             />
             <label>vendor ID</label>
             <INPUT
               type="text"
               name="vendorId"
               id="vendorId"
               value={vendorAssetSearchData.vendorId}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                 handleChange({
                   ...e,
                   target: { ...e.target, name: "vendorId" },
                 })
               }
             />
             <label>Status</label>
             <INPUT
               type="text"
               name="status"
               id="status"
               value={vendorAssetSearchData.status}
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

export default GetAssetsByVendor