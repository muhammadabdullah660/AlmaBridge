"use client"

import { FormErrors, LoginCredentials } from "@/types";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { validateSignIn } from "./FormValidation";
import { loginUser } from "@/lib/api/authService";
import Image from "next/image";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";

export default function SignInForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginCredentials>({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateSignIn(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginUser(formData);
            localStorage.setItem("token", response.token);

            if (response.isVerified) {
                handleRoute("/create-profile")
            }
            else {
                handleRoute("/account-auth")
            }
        } catch (error) {
            setErrors({ email: "Invalid Credentails or server error." });
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]:value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }))
    };

    const handleRoute = (path: string): void => {
        router.push(path);
    }

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
                                Welcome to Almabridge
                            </motion.h1>
                            <motion.p
                                className="mt-2 text-gray-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Connect with your alma mater
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
                        <div className="space-y-2 relative">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type={showPassword ? "text" : "password"}  value={formData.password} onChange={handleChange} placeholder="Enter your password" required ></Input>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 top-6 right-0 flex items-center hover:bg-transparent"
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

                        <Button
                            variant={"default"}
                            size={"lg"}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-delay-3"
                            type="submit"
                        >
                            { isLoading ? "Signing in..." : "Sign in" }
                        </Button>
                    </motion.form>
                    <div className="mt-6 sm:flex sm:justify-between text-sm animate-fade-in-delay-4 text-gray-400">
                        <p className='text-center sm:m-0 mb-3'>
                            Don&apos;t have account?&nbsp; 
                            <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                SignUp
                            </Link>
                        </p>
                        <Link
                            href="/forgot-password"
                            className="text-gray-400 hover:text-blue-300 transition-colors duration-300"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );

}