"use client"

import React, { useState } from "react"
import {motion} from "framer-motion"
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import Link from "next/link";
import Image from "next/image";
import { ForgotPasswordCredential, ForgotPasswordFormErrors } from "@/types";
import { validateForgotPasswordForm } from "./FormValidation";
import { ForgotPassword } from "@/lib/api/authService";
import { X } from "lucide-react";

export default function ForgotPasswordForm() {
    const [formData, setFormData] = useState<ForgotPasswordCredential>({
        email: "",
    });

    const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const closeModal = () => setShowModal(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]:value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }))
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForgotPasswordForm(formData);

        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const message = await ForgotPassword(formData);
            console.log(message);
            setShowModal(true);
        } catch(error) {
            console.error("Something Went Wrong: ", error);
            setErrors({email: "Something Went Wrong While Sending Password Reset"});
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
                                &quot;Forgot your password? No worries!&quot;
                            </motion.h1>
                            <motion.p
                                className="mt-2 text-gray-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                &quot;Life happens, even to passwords.&quot;
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
                            <Label htmlFor="email" >Email</Label>
                            <Input id="email" name="email" type="text" value={formData.email} onChange={handleChange} placeholder="Enter your email" required ></Input>
                            { errors.email && (
                                <motion.p
                                    className="text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors.email}
                                </motion.p>
                            )}
                        </div>
                        <Button
                            variant={"default"}
                            size={"lg"}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-delay-3"
                            type="submit"
                        >
                            { isLoading ? "Requesting Reset Password ..." : "Reset Password" }
                        </Button>
                    </motion.form>
                    {/* Links */}
                    <div className="mt-6 text-sm text-center animate-fade-in-delay-4 text-gray-400">
                        <Link
                            href="/signin"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        >
                            &larr; Back to Sign In
                        </Link>
                    </div>
                </motion.div>
            </div>

            {showModal && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/50" 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                >
                    <div className="relative w-full max-w-md p-6 rounded-lg backdrop-blur-md bg-black/30 border border-gray-700/50 shadow-xl">
                        {/* Close button */}
                        <button 
                            onClick={() => closeModal()}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                
                        {/* Success icon */}
                        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-500/10 mb-4">
                            <svg 
                            className="w-6 h-6 text-green-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 13l4 4L19 7" 
                            />
                            </svg>
                        </div>
                
                        {/* Content */}
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-white mb-2">
                            Check your email
                            </h3>
                            <p className="text-gray-300">
                            A link to reset your password has been sent to your email.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}