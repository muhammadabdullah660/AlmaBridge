import { LoginCredentials, FormErrors, RegisterCredentials, RegisterFormErrors, AuthFormData, AuthFormErrors, ForgotPasswordCredential, ForgotPasswordFormErrors, ResetPasswordForm, ResetPasswordErrors } from "@/types";

export const validateSignIn = (formData: LoginCredentials) => {
    const errors: FormErrors = {};

    if (!formData.email) {
        errors.email = "Email address is required.";
    } else if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
        errors.password = "Password is required.";
    }

    return errors;
};


export const validateSignUp = (formData: RegisterCredentials) => {
    const errors: RegisterFormErrors = {};

    if (!formData.firstName) errors.firstName = "FirstName is required.";
    if (!formData.lastName) errors.lastName = "Last name is required.";
    if (!formData.email) {
        errors.email = "Email Address is required.";
    } else if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
        errors.email = "Please enter a valid email address.";
    }

    if (formData.role === "student") {
        if (!formData.studentEmail) {
            errors.studentEmail = "Student email is required.";
        } else if (!/^\d{4}[a-zA-Z]{2,}[0-9]+@student\.uet\.edu\.pk$/.test(formData.studentEmail)) {
            errors.studentEmail = "Student email must be in the format: [year][dept][reg no]@student.uet.edu.pk.";
        }
    }

    if (!formData.password || formData.password.length < 6) errors.password = "Invalid Password.";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    if (formData.confirmPassword !== formData.password) errors.password = "Passwords do not match."; 
    
    return errors;
};


export const validateAccountAuthForm = (formData: AuthFormData) => {
    const errors: AuthFormErrors = {}

    if (!formData.verifCode) {
        errors.verifCode = "Verification Code is Missing."
    } else if (!formData.verifCode.match(/^(?=.*[A-Z])(?=.*\d)[A-Z\d]{8}$/)) {
        errors.verifCode = "Please enter a valid verification code."
    }

    return errors;
};


export const validateForgotPasswordForm = (formData: ForgotPasswordCredential) => {
    const errors: ForgotPasswordFormErrors = {};

    if (!formData.email) {
        errors.email = "Email address is required.";
    } else if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
        errors.email = "Please enter a valid email address.";
    }

    return errors;
}

export const validateResetPasswordForm = (formData: ResetPasswordForm) => {
    const errors: ResetPasswordErrors = {};

    if (!formData.password || formData.password.length < 6) errors.password = "Invalid Password.";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    if (formData.confirmPassword !== formData.password) errors.password = "Passwords do not match."; 

    return errors;
}