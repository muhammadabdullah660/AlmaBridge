// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProfileData, PeopleType } from "@/types";
import axios from "axios";
import { UserDataResponse } from "@/types";

axios.defaults.withCredentials = true;

const GetUserInfo = async (): Promise<UserDataResponse> => {
  try {
    const response = await axios.get(`http://localhost:3001/api/profile`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GetAllPeople = async (): Promise<PeopleType[]> => {
  try {
    const userData: UserDataResponse = await GetUserInfo();
    const response = await axios.post(
      `http://127.0.0.1:5001/api/recommend`,
      userData, // ✅ send the raw object
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.recommendations);
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};

// Helper function to transform API response to match our frontend Achivement interface
