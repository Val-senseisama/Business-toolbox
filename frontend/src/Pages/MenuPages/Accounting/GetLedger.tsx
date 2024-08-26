import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useQuery } from '@apollo/client';
import { GET_LEDGER } from '../../../GraphQL/Queries';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetLedger = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [ledgerSearchData, setLedgerSearchData] = useState({
        companyId: "",
        offset: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLedgerSearchData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        Session.remove("alerts");
    };

    const {
        loading,
        data: ledgerData,
        refetch: getLedger,
    } = useQuery(GET_LEDGER, {
        onCompleted: () => {
            setIsLoading(false);
            if (ledgerData?.getAllLedgers) {
                Session.saveAlert("Ledgers fetched sucessfully", "success");
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

    const getAllLedgers = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        getLedger({ variables: { ...ledgerSearchData } });
    };

    return (
        <>
            <div className="container">
                <div className="d-flex flex-wrap align-content-center">
                    <PAGETITLE>GET ALL LEDGERS</PAGETITLE>
                    <form onSubmit={getAllLedgers}>
                        <label>Company ID</label>
                        <INPUT
                            type="text"
                            name="companyId"
                            id="companyId"
                            value={ledgerSearchData.companyId}
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
                            value={ledgerSearchData.offset}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange({
                                    ...e,
                                    target: { ...e.target, name: "offset" },
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

export default GetLedger;