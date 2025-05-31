"use client"

import Image from "next/image"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { ResendAuthCode, UserAccountAuth } from "@/lib/api/authService"
import type { AuthFormData, AuthFormErrors } from "@/types"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useCallback, memo } from "react"
import { validateAccountAuthForm } from "./FormValidation"

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

export default function AccountAuthentificationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<AuthFormData>({
    verifCode: "",
  })

  const [error, setError] = useState<AuthFormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: "" }))
  }, [])

  const handleResendCode = useCallback(async () => {
    try {
      const message = await ResendAuthCode()
      console.log("Message: ", message)
    } catch (error) {
      console.error("Something Went Wrong:", error)
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const validationErrors = validateAccountAuthForm(formData)

      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors)
        return
      }

      setIsLoading(true)

      try {
        const message = await UserAccountAuth(formData)
        console.log("Message: ", message)
        router.push("/create-profile")
      } catch (error) {
        console.error("Something Went Wrong: ", error)
        setError({ verifCode: "Invalid Verification Code or Server Error" })
      } finally {
        setIsLoading(false)
      }
    },
    [formData, router],
  )

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
              <h1 className="mt-4 text-3xl font-bold text-white">Verify Your Account</h1>
              <p className="mt-2 text-gray-300">We have sent a verification code to your provided email.</p>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verifCode">Verify Code</Label>
              <Input
                id="verifCode"
                name="verifCode"
                type="text"
                value={formData.verifCode}
                onChange={handleChange}
                placeholder="Paste or Type Verification Code here..."
                required
              />
              {error.verifCode && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">{error.verifCode}</p>
              )}
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Didn&apos;t receive a code?{" "}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:bg-transparent"
              >
                Resend
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
