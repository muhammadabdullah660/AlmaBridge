"use client"

import { motion } from "framer-motion"
import Image from "next/image";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { ResendAuthCode, UserAccountAuth } from "@/lib/api/authService";
import { AuthFormData, AuthFormErrors } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react"
import { validateAccountAuthForm } from "./FormValidation";


export default function AccountAuthentificationForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<AuthFormData>({
        verifCode: "",
    });

    const [error, setError] = useState<AuthFormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]:value });

        setError((prevErrors) => ({...prevErrors, [name]: ""}));
    };

    const handleResendCode = async () => {
        try{
            const token = localStorage.getItem("token") || "";
            const message = await ResendAuthCode(token);
            console.log("Mesage: ", message);
        } catch (error) {
            console.error("Something Went Wrong:" , error);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateAccountAuthForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token") || "";
            const message = await UserAccountAuth(formData, token);
            console.log("Message: ", message);
            router.push("/createProfile");
        } catch (error) {
            console.error("Something Went Wrong: ", error);
            setError({ verifCode: "Invalid Verification Code or Server Error" });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background Animation */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute -inset-[10px] opacity-50">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[80px] animate-pulse"></div>
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[80px] animate-pulse delay-700"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[80px] animate-pulse delay-500"></div>
                </div>
            </div>

            {/* Main Content */}
            
            <div
                className="w-full max-w-md relative"
            >
                {/* Card with glassmorphism effect */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                >   
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div>
                            <Image
                                alt="Your Company"
                                src="/assets/logo.png"
                                width={60}
                                height={60}
                                className="mx-auto"
                            />
                        </div>
                        <div className="mt-3">
                            <motion.h1
                                className="mt-4 text-3xl font-bold text-white"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Verify Your Account
                            </motion.h1>
                            <motion.p
                                className="mt-2 text-gray-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                We have sent a verification code to your provided email.
                            </motion.p>
                        </div>
                    </div>
                    {/* Sign In Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="verifCode" >Verify Code</Label>
                            <Input id="verifCode" name="verifCode" type="text" value={formData.verifCode} onChange={handleChange} placeholder="Paste or Type Verification Code here..." required ></Input>
                            { error.verifCode && (
                                <motion.p
                                    className="text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {error.verifCode}
                                </motion.p>
                            )}
                        </div>
                        <Button
                            variant={"default"}
                            size={"lg"}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-delay-3"
                            type="submit"
                        >
                            { isLoading ? "Verifying..." : "Verify" }
                        </Button>
                    </motion.form>
                    {/* Resend Code */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Didn&apos;t receive a code?{" "}
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            onClick={handleResendCode}
                            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:bg-transparent"
                        >
                            Resend
                        </Button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}