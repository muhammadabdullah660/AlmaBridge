import { ProfileUserDataResponse } from "@/types";
import axios from "axios"
axios.defaults.withCredentials = true;

export const UpdateProfile = async (formData: FormData): Promise<string> => {
    try{
        console.log(formData);
        const response = await axios.post(
            `http://localhost:3001/api/profile`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response.data.message;
    } catch(error){
        throw error;
    }
}

export const getUserProfileData = async (): Promise<ProfileUserDataResponse> => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/profile",
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = response.data;

    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      profile: {
        profileImage: data.profile?.profileImage
          ? `https://almabridgeworker.muhammadshahzaibijaz34.workers.dev/${data.profile.profileImage}`
          : "/assets/placeholder.svg",
        address: data.profile?.address || "",
        linkedin: data.profile?.linkedin || "",
        bio: data.profile?.bio || "",
        gender: data.profile?.gender || "",
        secondaryEmail: data.profile?.secondaryEmail || "",
        portfolio: data.profile?.portfolio || "",
        linktree: data.profile?.linktree || "",
        educations: data.profile?.educations || [],
        experiences: data.profile?.experiences || [],
        skills: data.profile?.skills || [],
        certificates: data.profile?.certificates || [],
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};