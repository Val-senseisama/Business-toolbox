import React, { useState } from 'react'
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNTING_YEARS } from '../../../GraphQL/Queries';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetAccountingYears = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [accountingYearSearchData, setAccountingYearSearchData] = useState({
        companyId: "",
        offset: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountingYearSearchData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        Session.remove("alerts");
    };

    const {
        loading,
        data: accountingYearsData,
        refetch: accountingYears,
    } = useQuery(GET_ACCOUNTING_YEARS, {
        variables: {
            companyId: accountingYearSearchData.companyId,
            offset: accountingYearSearchData.offset,
        },
        onCompleted: () => {
            setIsLoading(false);
            if (accountingYearsData?.getAllAccountingyears) {
                Session.saveAlert("Accounting years fetched successfully", "success");
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

    const getAllAccountingYears = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        accountingYears();
    };

    return (
        <>
            <div className="container">
                <div className="d-flex flex-wrap align-content-center">
                    <PAGETITLE>GET ALL ACCOUNTING YEARS</PAGETITLE>
                    <form onSubmit={getAllAccountingYears}>
                        <label>Company ID</label>
                        <INPUT
                            type="text"
                            name="companyId"
                            id="companyId"
                            value={accountingYearSearchData.companyId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({
                                ...e,
                                target: { ...e.target, name: "companyId" },
                            })}
                        />

                        <label>Offset</label>
                        <INPUT
                            type="text"
                            name="offset"
                            id="offset"
                            value={accountingYearSearchData.offset}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({
                                ...e,
                                target: { ...e.target, name: "offset" },
                            })}
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

export default GetAccountingYears;