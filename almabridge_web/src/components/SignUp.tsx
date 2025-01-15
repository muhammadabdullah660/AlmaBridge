/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  studentEmail: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  studentEmail?: string;
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    studentEmail: "",
  });

  // let address, aboutMe, linkedin, bio, gender, secondaryEmail, school, degree, fieldOfStudy, graduationYear, company, startDate, endDate, description, skillName, certificationName, issuer, date, portfolio, linktree, resume;



  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({}); // Specify the type
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error for the changed field
  };

  const validateForm = (): FormErrors => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const newErrors: FormErrors = {};

    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!email) newErrors.email = "Email address is required.";
    if (formData.role === "student") {
      if (!formData.studentEmail) {
        newErrors.studentEmail = "Student email is required.";
      } else if (
        !/^\d{4}[a-zA-Z]{2,}[0-9]+@student\.uet\.edu\.pk$/.test(
          formData.studentEmail
        )
      ) {
        newErrors.studentEmail =
          "Student email must be in the format: [year][dept][reg no]@student.uet.edu.pk.";
      }
    }
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";

    return newErrors; // Return the errors object
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set the validation errors
    } else {
      setErrors({}); // Clear errors
      // Handle form submission (e.g., send data to your server)
      const { firstName, lastName, email, password, role, studentEmail } =
        formData;
      setIsLoading(true);

      // register the user
      axios
        .post("http://127.0.0.1:3001/api/register", {
          firstName,
          lastName,
          email,
          password,
          role,
          studentEmail,
        })
        .then((response) => {
          console.log("Registration successful:", response.data);

          const token = response.data.token;
          localStorage.setItem("token", token);
          // Redirect to the Account Auth Page
          router.push("/accountAuth");
        })
        .catch((error) => {
          if(axios.isAxiosError(error) && error.response) {
            if (error.response.status === 409) {
              const newErrors: FormErrors = {};
              newErrors.email = "This Email is ALready Exist in our system";
              setErrors(newErrors);
            }
          }
        });

      //console.log("Form submitted successfully:", formData);
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData((prevData) => ({ ...prevData, role }));
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
            Your first step towards change!
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Role Selection Buttons */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`px-4 py-2 rounded-l-md text-sm font-semibold bg-white-600 text-gray-900 border-2 border-r-0 ${formData.role === "student"
                  ? "border-[#00BDD6]"
                  : "border-gray-300"
                }`}
            >
              I am a student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("alumni")}
              className={`px-4 py-2 rounded-r-md text-sm font-semibold bg-white-600 text-gray-900 border-2 ${formData.role === "alumni"
                  ? "border-[#00BDD6]"
                  : "border-gray-300"
                }`}
            >
              I am an alumni
            </button>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
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
            {formData.role === "student" && (
              <div>
                <label
                  htmlFor="studentEmail"
                  className="block text-sm font-medium text-gray-900"
                >
                  Student Email
                </label>
                <input
                  id="studentEmail"
                  name="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
                {errors.studentEmail && (
                  <p className="text-red-500 text-sm">{errors.studentEmail}</p>
                )}
              </div>
            )}

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-gray-500"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#00BDD6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#00BDD6]-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-[#00BDD6] hover:text-[#00BDD6]-900"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
