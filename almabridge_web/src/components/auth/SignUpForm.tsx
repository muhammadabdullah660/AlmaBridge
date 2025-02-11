"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { RegisterCredentials, RegisterFormErrors } from "@/types";
import { validateSignUp } from "./FormValidation";
import { RegisterUser } from "@/lib/api/authService";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUpForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterCredentials>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        studentEmail: "",
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]:value });
        setErrors((prevErrors) => ({...prevErrors, [name]: ""}));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateSignUp(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try{
            const token = await RegisterUser(formData);
            
            localStorage.setItem("token", token);
            router.push("/account-auth");
        } catch(error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    setErrors({ email: "This Email already exists in our system" });
                }
                else {
                    toast.error("Something Wrong Happens");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleRoleChange = (role: string) => {
        setFormData((prevData) => ({ ...prevData, role }))
    };


    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background Animation */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute -inset-[10px] opacity-50">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[80px] animate-pulse"></div>
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[80px] animate-pulse delay-700"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[80px] animate-pulse delay-500"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-md relative" >
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
                                Your first step towards change!
                            </motion.h1>
                            <motion.p
                                className="mt-2 text-gray-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Join Almabridge today
                            </motion.p>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="flex justify-center mb-6 animate-fade-in-delay-2">
                        <button
                            type="button"
                            onClick={() => handleRoleChange("student")}
                            className={`px-6 py-2 rounded-l-lg text-sm font-semibold transition-all duration-300 ${
                                formData.role === "student"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange("alumni")}
                            className={`px-6 py-2 rounded-r-lg text-sm font-semibold transition-all duration-300 ${
                                formData.role === "alumni"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            Alumni
                        </button>
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
                            <Label htmlFor="firstName" >FirstName</Label>
                            <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="Enter your firstname" required ></Input>
                            { errors.firstName && (
                                <motion.p
                                    className="text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors.firstName}
                                </motion.p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" >LastName</Label>
                            <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Enter your lastName" required ></Input>
                            { errors.lastName && (
                                <motion.p
                                    className="text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors.lastName}
                                </motion.p>
                            )}
                        </div>
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
                        {formData.role === 'student' && (
                            <div className="space-y-2">
                                <Label htmlFor="studentEmail" >Student Email</Label>
                                <Input id="studentEmail" name="studentEmail" type="text" value={formData.studentEmail} onChange={handleChange} placeholder="Enter your student email (@student.uet.edu.pk)" required ></Input>
                                { errors.studentEmail && (
                                    <motion.p
                                        className="text-red-500 text-sm"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {errors.studentEmail}
                                    </motion.p>
                                )}
                            </div>
                        )}
                        <div className="space-y-2 relative">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type={showPassword ? "text" : "password"}  value={formData.password} onChange={handleChange} placeholder="Enter your password" required ></Input>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 top-7 right-1 flex items-center hover:bg-transparent"
                            >
                                {showPassword ? <Eye /> : <EyeClosed />}
                            </Button>
                            { errors.password && (
                                <motion.p
                                    className="text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors.password}
                                </motion.p>
                            )}
                        </div>

                        <div className="space-y-2 relative">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"}  value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required ></Input>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute inset-y-0 top-7 right-1 flex items-center hover:bg-transparent"
                            >
                                {showConfirmPassword ? <Eye /> : <EyeClosed />}
                            </Button>
                            { errors.confirmPassword && (
                                <motion.p
                                    className="text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </div>

                        <Button
                            variant={"default"}
                            size={"lg"}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-delay-3"
                            type="submit"
                        >
                            { isLoading ? "Creating Account..." : "Sign up" }
                        </Button>
                    </motion.form>
                    <p className="mt-6 text-center text-sm text-gray-400 animate-fade-in-delay-4">
                        Already a member?{" "}
                        <Link
                            href="/sign-in"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        >
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>

        </div>
    );   
}