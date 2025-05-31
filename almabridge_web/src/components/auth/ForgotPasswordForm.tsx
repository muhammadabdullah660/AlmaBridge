"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import Link from "next/link"
import Image from "next/image"
import type { ForgotPasswordCredential, ForgotPasswordFormErrors } from "@/types"
import { validateForgotPasswordForm } from "./FormValidation"
import { ForgotPassword } from "@/lib/api/authService"
import { X } from "lucide-react"

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

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordCredential>({
    email: "",
  })

  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  const closeModal = useCallback(() => setShowModal(false), [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const validationErrors = validateForgotPasswordForm(formData)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setIsLoading(true)

      try {
        const message = await ForgotPassword(formData)
        console.log(message)
        setShowModal(true)
      } catch (error) {
        console.error("Something Went Wrong: ", error)
        setErrors({ email: "Something Went Wrong While Sending Password Reset" })
      } finally {
        setIsLoading(false)
      }
    },
    [formData],
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
              <h1 className="mt-4 text-3xl font-bold text-white">&quot;Forgot your password? No worries!&quot;</h1>
              <p className="mt-2 text-gray-300">&quot;Life happens, even to passwords.&quot;</p>
            </div>
          </div>

          {/* Forgot Password Form */}
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
            <Button
              variant="default"
              size="lg"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Requesting Reset Password ..." : "Reset Password"}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-sm text-center text-gray-400">
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-lg backdrop-blur-md bg-black/30 border border-gray-700/50 shadow-xl animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Success icon */}
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-500/10 mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
              <p className="text-gray-300">A link to reset your password has been sent to your email.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
