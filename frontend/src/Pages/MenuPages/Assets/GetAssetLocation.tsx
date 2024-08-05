import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useQuery } from '@apollo/client';
import { GET_ASSETS_BY_LOCATION } from '../../../GraphQL/Queries';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetAssetLocation = () => {
   const [isLoading, setIsLoading] = useState(false);

   const [assetLocationSearchData, setassetLocationSearchData] = useState({
     companyId: "",
     offset: "",
     locationId: "",
     status: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setassetLocationSearchData((prevData) => ({
       ...prevData,
       [name]: value,
     }));
     Session.remove("alerts");
   };

   const {
     loading,
     data: assetLocationsData,
     refetch: assetLocations,
   } = useQuery(GET_ASSETS_BY_LOCATION, {
     onCompleted: () => {
       setIsLoading(false);
       if (assetLocationsData?.assetLocations) {
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
     assetLocations({ variables: { ...assetLocationSearchData } });
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
               value={assetLocationSearchData.companyId}
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
               value={assetLocationSearchData.offset}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                 handleChange({
                   ...e,
                   target: { ...e.target, name: "offset" },
                 })
               }
             />
             <label>Location Id</label>
             <INPUT
               type="text"
               name="locationId"
               id="locationId"
               value={assetLocationSearchData.locationId}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                 handleChange({
                   ...e,
                   target: { ...e.target, name: "locationId" },
                 })
               }
             />
             <label>Status</label>
             <INPUT
               type="text"
               name="status"
               id="status"
               value={assetLocationSearchData.status}
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

export default GetAssetLocation