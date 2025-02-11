/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error for the changed field
  };

  const validateForm = (): FormErrors => {
    const { email, password } = formData;
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) newErrors.password = "Password is required.";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { email, password } = formData;
      const response = await axios.post(`http://127.0.0.1:3001/api/login`, {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      const isUserVerified = response.data.isVerified;
      if(isUserVerified) {
        router.push("/createprofile");
      }
      else {
        router.push("/accountAuth");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ email: "Invalid credentials or server error." });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSignUpBtn = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/signup');
  };  

  return (
    <div className="flex flex-col justify-center font-[sans-serif] min-h-screen p-2">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src="/assets/logo.png"
            width={120}
            height={120}
            className="mx-auto"
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#00BDD6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/signup"
              onClick={handleSignUpBtn}
              className="font-semibold leading-6 text-[#00BDD6] hover:text-teal-500"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
