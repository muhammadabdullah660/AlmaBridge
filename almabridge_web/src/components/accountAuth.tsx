"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


interface FormData {
    verifCode: string;
}

interface FormErrors {
    verifCode?: string;
}


export default function AccountAuthentification() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        verifCode: "", 
    });
 
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});

        setErrors((prevErrors) => ({...prevErrors, [name]: ""}));
    };

    const validateForm = (): FormErrors => {
        const {verifCode} = formData;
        const newErrors: FormErrors = {};

        if (!verifCode) {
            newErrors.verifCode = "Verification Code is Missing.";
        } else if (!verifCode.match(/^(?=.*[A-Z])(?=.*\d)[A-Z\d]{8}$/)) {
            newErrors.verifCode = "Please enter a valid verification code.";
        }

        return newErrors;
    };

    const handleResendCode = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://127.0.0.1:3001/api/resendCode`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Message: ", response.data);
        }
        catch (error) {
            console.error("Something Went Wrong:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validateForm).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const { verifCode } = formData;
            const token = localStorage.getItem("token"); 
            const response = await axios.post(
                `http://127.0.0.1:3001/api/verifyAccount`,
                { verificationCode: verifCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Message: ", response.data);
            router.push("/createprofile");
        }
        catch (error) {
            console.error("Something Went Wrong:", error);
            setErrors({verifCode: "Invalid Verification Code or Server error."});
        }
        finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col justify-center font-[sans-serif] min-h-screen p-2">
            <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                alt="Your Company"
                src="/assets/logo.png"
                width={120}
                height={120}
                className="mx-auto"
                />
                <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Verify Your Account
                </h2>
                <p className="mt-2 text-center text-sm leading-6 text-gray-600">We have sent a verification code to your provided email.</p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input onChange={handleChange} type="text" name="verifCode" id="verifCode" required placeholder="Verification Code Here..." className="block w-full rounded-md border-0 p-1.5 ps-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                        {errors.verifCode && (
                            <p className="text-red-500 text-sm">{errors.verifCode}</p>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-[#00BDD6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                            {isLoading ? "Verifying..." : "Verify"}
                        </button>
                    </div>
                </form>
            </div>
    
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <p className="mt-10 text-center text-sm text-gray-500">
                Didn&apos;t Recieve Code?{" "}
                <button
                    onClick={handleResendCode}
                    className="font-semibold leading-6 text-[#00BDD6] hover:text-teal-500"
                >
                    Resend
                </button>
                </p>
            </div>
            </div>
        </div>
    );
}