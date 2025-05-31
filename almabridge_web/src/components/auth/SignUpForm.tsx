"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import Image from "next/image"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import Link from "next/link"
import { Eye, EyeClosed } from "lucide-react"
import { useRouter } from "next/navigation"
import type { RegisterCredentials, RegisterFormErrors } from "@/types"
import { validateSignUp } from "./FormValidation"
import { RegisterUser } from "@/lib/api/authService"
import axios from "axios"
import { toast } from "react-toastify"

// Reuse the same optimized background
const OptimizedBackground = memo(() => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
    <div
      className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "0.7s" }}
    />
    <div
      className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "0.5s" }}
    />
  </div>
))

OptimizedBackground.displayName = "OptimizedBackground"

export default function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    studentEmail: "",
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const validationErrors = validateSignUp(formData)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setIsLoading(true)

      try {
        const response = await RegisterUser(formData);
        localStorage.setItem("firstName", response.firstName);
        localStorage.setItem("lastName", response.lastName);
        localStorage.setItem("email", response.email);
        router.push("/account-auth")
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409) {
            setErrors({ email: "This Email already exists in our system" })
          } else {
            toast.error("Something Wrong Happens")
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [formData, router],
  )

  const handleRoleChange = useCallback((role: string) => {
    setFormData((prev) => ({ ...prev, role }))
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <OptimizedBackground />

      <div className="w-full max-w-md relative animate-in fade-in duration-500">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div>
              <Image alt="Your Company" src="/assets/logo.png" width={60} height={60} className="mx-auto" priority />
            </div>
            <div className="mt-3">
              <h1 className="mt-4 text-3xl font-bold text-white">Your first step towards change!</h1>
              <p className="mt-2 text-gray-300">Join Almabridge today</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`px-6 py-2 rounded-l-lg text-sm font-semibold transition-all duration-200 ${
                formData.role === "student" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("alumni")}
              className={`px-6 py-2 rounded-r-lg text-sm font-semibold transition-all duration-200 ${
                formData.role === "alumni" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Alumni
            </button>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">FirstName</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your firstname"
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">LastName</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your lastName"
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">{errors.email}</p>
              )}
            </div>

            {formData.role === "student" && (
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Student Email</Label>
                <Input
                  id="studentEmail"
                  name="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  placeholder="Enter your student email (@student.uet.edu.pk)"
                  required
                />
                {errors.studentEmail && (
                  <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                    {errors.studentEmail}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 top-7 right-1 flex items-center hover:bg-transparent"
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
              </Button>
              {errors.password && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 top-7 right-1 flex items-center hover:bg-transparent"
              >
                {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
              </Button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
