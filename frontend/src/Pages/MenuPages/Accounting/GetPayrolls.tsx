import React, { useState } from 'react';
import { BLOCKBUTTON, INPUT } from '../../../Components/Forms';
import Session from '../../../Helpers/Session';
import { useQuery } from '@apollo/client';
import { GET_ALL_PAYROLL } from '../../../GraphQL/Queries';
import { APIResponse } from '../../../Helpers/General';
import { PAGETITLE } from '../../../Components/Typography';

const GetAllPayrolls = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [payrollSearchData, setpayrollSearchData] = useState({
        companyId: "",
        offset: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setpayrollSearchData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        Session.remove("alerts");
    };

    const {
        loading,
        data: payrollsData,
        refetch: payrolls,
    } = useQuery(GET_ALL_PAYROLL, {
        onCompleted: () => {
            setIsLoading(false);
            if (payrollsData?.getAllPayrolls) {
                Session.saveAlert("Payrolls fetched sucessfully", "success");
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

    const getAllPayrolls = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        payrolls({ variables: { ...payrollSearchData } });
    };

    return (
        <>
            <div className="container">
                <div className="d-flex flex-wrap align-content-center">
                    <PAGETITLE>GET ALL PAYROLLS</PAGETITLE>
                    <form onSubmit={getAllPayrolls}>
                        <label>Company ID</label>
                        <INPUT
                            type="text"
                            name="companyId"
                            id="companyId"
                            value={payrollSearchData.companyId}
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
                            value={payrollSearchData.offset}
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

export default GetAllPayrolls;