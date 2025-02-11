// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProfileData, AlumniSuggestions } from "@/types";
import axios from "axios";

export const GetAllSuggestions = async (): // userData: ProfileData
Promise<AlumniSuggestions[]> => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:5001/api/recommend`,
      // JSON.stringify(userData),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.recommendations);

    return response.data.recommendations;
  } catch (error) {
    throw error;
  }
};

// Helper function to transform API response to match our frontend Achivement interface
