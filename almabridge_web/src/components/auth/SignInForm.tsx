"use client"

import type { FormErrors, LoginCredentials } from "@/types"
import { Label } from "../ui/Label"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useCallback, memo } from "react"
import { validateSignIn } from "./FormValidation"
import { loginUser } from "@/lib/api/authService"
import Image from "next/image"
import { Eye, EyeClosed } from "lucide-react"
import Link from "next/link"

// Optimized background component
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

export default function SignInForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const validationErrors = validateSignIn(formData)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setIsLoading(true)

      try {
        const response = await loginUser(formData)

        localStorage.setItem("firstName", response.firstName);
        localStorage.setItem("lastName", response.lastName);
        localStorage.setItem("email", response.email);

        if (response.isVerified) {
          router.push("/dashboard")
        } else {
          router.push("/account-auth")
        }
      } catch (error) {
        setErrors({ email: "Invalid Credentials or server error." })
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    },
    [formData, router],
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <OptimizedBackground />

      <div className="w-full max-w-md relative animate-in fade-in duration-500">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div>
              <Image alt="Your Company" src="/assets/logo.png" width={60} height={60} className="mx-auto" priority />
            </div>
            <div className="mt-3">
              <h1 className="mt-4 text-3xl font-bold text-white">Welcome to Almabridge</h1>
              <p className="mt-2 text-gray-300">Connect with your alma mater</p>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 top-7 right-1 flex items-center hover:bg-transparent"
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
              </Button>
              {errors.password && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">{errors.password}</p>
              )}
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 sm:flex sm:justify-between text-sm text-gray-400">
            <p className="text-center sm:m-0 mb-3">
              Don&apos;t have account?&nbsp;
              <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                SignUp
              </Link>
            </p>
            <Link href="/forgot-password" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
