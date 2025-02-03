import { AuthResponse, LoginCredentials, RegisterCredentials, AuthFormData, ForgotPasswordCredential, ResetPasswordResponse, ResetPasswordForm } from "@/types";
import axios from "axios";

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try{
        const response = await axios.post(`http://127.0.0.1:3001/api/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const RegisterUser = async (credentials: RegisterCredentials): Promise<string> => {
    try{
        const response = await axios.post(`http://127.0.0.1:3001/api/register`, credentials);
        return response.data.token;
    } catch (error) {
        throw error;
    }
};


export const UserAccountAuth = async (credentials: AuthFormData, token: string): Promise<string> => {
    try{
        const response = await axios.post(`http://127.0.0.1:3001/api/verifyAccount`,
            { verificationCode: credentials.verifCode },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data.message;
    } catch (error) {
        throw error;
    }
}


export const ResendAuthCode = async (token: string): Promise<string> => {
    try{
        const response = await axios.post(
            `http://127.0.0.1:3001/api/resendCode`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.message;
    } catch (error) {
        throw error;
    }
}


export const ForgotPassword = async (credential: ForgotPasswordCredential): Promise<string> => {
    try{
        const response = await axios.post(`http://127.0.0.1:3001/api//forgotPassword`,
            { email: credential.email },
        );
        return response.data.message;
    } catch(error) {
        throw error;
    }
}


export const ValidateResetToken = async (resetToken: string): Promise<ResetPasswordResponse> => {
    try{
        const response = await axios.post(`http://127.0.0.1:3001/api/validateLink`, resetToken);
        return response.data;
    } catch(error) {
        throw error;
    }
}

export const UpdatePassword = async (formData: ResetPasswordForm, userId: string): Promise<string> => {
    try{
        const response = await axios.post(
            `http://127.0.0.1:3001/api/updatePassword`,
            { userId:  userId, password: formData.password}
        );
        return response.data.message;
    } catch(error) {
        throw error;
    }
}
