"use client"

import type React from "react"
import { useEffect, useState, useCallback, memo } from "react"
import { Button } from "../ui/Button"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import Image from "next/image"
import { Eye, EyeIcon as EyeClosed } from "lucide-react"
import type { ResetPasswordErrors, ResetPasswordForm, ResetPasswordProps } from "@/types"
import { useRouter } from "next/navigation"
import { UpdatePassword, ValidateResetToken } from "@/lib/api/authService"
import { validateResetPasswordForm } from "./FormValidation"

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

const ResetPassword: React.FC<ResetPasswordProps> = ({ resetToken }) => {
  const [formData, setFormData] = useState<ResetPasswordForm>({
    password: "",
    confirmPassword: "",
  })

  const [errors, setError] = useState<ResetPasswordErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    const validateToken = async () => {
      if (!resetToken) {
        setIsLinkValid(false)
        return
      }

      try {
        const data = await ValidateResetToken(resetToken)
        setIsLinkValid(data.isLinkValid)
        localStorage.setItem("userId", data.userId)
      } catch (error) {
        console.error("Link is Expired or Something Went Wrong", error)
        setIsLinkValid(false)
      }
    }
    validateToken()
  }, [resetToken])

  useEffect(() => {
    if (isLinkValid === false) {
      router.push("/404")
    }
  }, [isLinkValid, router])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const validationErrors = validateResetPasswordForm(formData)

      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors)
        return
      }

      setIsLoading(true)
      try {
        const userId = localStorage.getItem("userId") || ""
        const message = await UpdatePassword(formData, userId)
        console.log(message)
      } catch (error) {
        console.error("Something went wrong: ", error)
      } finally {
        setIsLoading(false)
        router.push("/sign-in")
      }
    },
    [formData, router],
  )

  if (isLinkValid === null) return <div>Loading...</div>
  if (!isLinkValid) return null

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
              <h1 className="mt-4 text-3xl font-bold text-white">&quot;New password, who dis?&quot;</h1>
              <p className="mt-2 text-gray-300">&quot;Don&apos;t worry, your old password had a good run.&quot;</p>
            </div>
          </div>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="absolute inset-y-0 top-6 right-0 flex items-center hover:bg-transparent"
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
                placeholder="Confirm Your Password..."
                required
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 top-6 right-0 flex items-center hover:bg-transparent"
              >
                {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
              </Button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                variant="default"
                size="lg"
                className="w-full py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
                type="button"
                onClick={() => router.push("/forgot-password")}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="lg"
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating Password..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
