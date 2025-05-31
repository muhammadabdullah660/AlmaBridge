import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  AuthFormData,
  ForgotPasswordCredential,
  ResetPasswordResponse,
  ResetPasswordForm,
} from "@/types";
import axios from "axios";

axios.defaults.withCredentials = true;

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/login`,
      credentials,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const RegisterUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try{
        const response = await axios.post(`http://localhost:3001/api/register`, credentials, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            } 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UserAccountAuth = async (
  credentials: AuthFormData
): Promise<string> => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/verifyAccount`,
      { verificationCode: credentials.verifCode },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const ResendAuthCode = async (): Promise<string> => {
  try {
    const response = await axios.post(`http://localhost:3001/api/resendCode`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const ForgotPassword = async (
  credential: ForgotPasswordCredential
): Promise<string> => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/forgotPassword`,
      { email: credential.email }
    );
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const ValidateResetToken = async (
  resetToken: string
): Promise<ResetPasswordResponse> => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/validateLink`,
      resetToken,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdatePassword = async (
  formData: ResetPasswordForm,
  userId: string
): Promise<string> => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/updatePassword`,
      { userId: userId, password: formData.password }
    );
    return response.data.message;
  } catch (error) {
    throw error;
  }
};
