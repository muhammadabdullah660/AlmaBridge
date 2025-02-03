"use client"

import React, { useEffect, useState } from "react"
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { motion } from "framer-motion"
import Image from "next/image";
import { Eye, EyeClosed } from "lucide-react";
import { ResetPasswordErrors, ResetPasswordForm, ResetPasswordProps } from "@/types"
import { useRouter } from "next/navigation";
import { UpdatePassword, ValidateResetToken } from "@/lib/api/authService";
import { validateResetPasswordForm } from "./FormValidation";

const ResetPassword: React.FC<ResetPasswordProps> = ({ resetToken }) => {
    
    const [formData, setFormData] = useState<ResetPasswordForm>({
        password: "",
        confirmPassword: ""
    });

    const [errors, setError] = useState<ResetPasswordErrors>({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    
    useEffect(() => {
        const validateToken = async () => {
            if (!resetToken) {
                setIsLinkValid(false);
                return;
            }

            try {
                const data = await ValidateResetToken(resetToken);
                setIsLinkValid(data.isLinkValid);
                localStorage.setItem("userId", data.userId);
            } catch (error) {
                console.error('Link is Expired or Something Went Wrong', error);
                setIsLinkValid(false);
            }
        };
        validateToken();
    }, [resetToken]);

    useEffect(() => {
        if (isLinkValid === false) {
            router.push('/404');
        }
    }, [isLinkValid, router]);

    if (isLinkValid === null) return <div>Loading...</div>;
    
    if (!isLinkValid) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateResetPasswordForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }
        setIsLoading(true);
        try{
            const userId = localStorage.getItem("userId") || "";
            const message = await UpdatePassword(formData, userId);
            console.log(message);
        } catch(error) {
            console.error("Something went wrong: ", error);
        } finally{
            setIsLoading(false);
            router.push("/sign-in");
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
                                &quot;New password, who dis?&quot;
                            </motion.h1>
                            <motion.p
                                className="mt-2 text-gray-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                &quot;Don&apos;t worry, your old password had a good run.&quot;
                            </motion.p>
                        </div>
                    </div>
                    {/* Reset Password Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
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

                        <div className="space-y-2 relative">
                            <Label htmlFor="confirmPassword">Password</Label>
                            <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"}  value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Your Password..." required ></Input>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute inset-y-0 top-6 right-0 flex items-center hover:bg-transparent"
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

                        <div className="space-y-2">
                            <Button
                                variant={"default"}
                                size={"lg"}
                                className="w-full py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-delay-3"
                                type="button"
                                onClick={() => {router.push("/forgot-password")}}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={"default"}
                                size={"lg"}
                                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-delay-3"
                                type="submit"
                            >
                                { isLoading ? "Updating Password..." : "Change Password" }
                            </Button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
};


export default ResetPassword;