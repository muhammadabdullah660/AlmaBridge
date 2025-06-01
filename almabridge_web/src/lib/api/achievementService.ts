import { Achievement, AchievementData, ApiAchievement } from "@/types";
import axios, { AxiosError } from "axios";

axios.defaults.withCredentials = true;

export const GetAllAchievements = async (): Promise<Achievement[]> => {
  try {
    const response = await axios.get<ApiAchievement[]>("http://localhost:3001/api/achievements", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.map(transformApiAchievementToAchievement);
  } catch (error) {
    const errorMessage = error instanceof AxiosError && error.response?.data?.message
      ? error.response.data.message
      : "Failed to fetch achievements";
    throw new Error(errorMessage);
  }
};

export const GetSpecificAchievements = async (): Promise<Achievement[]> => {
  try {
    const response = await axios.get<ApiAchievement[]>("http://localhost:3001/api/specific-achievements", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.map(transformApiAchievementToAchievement);
  } catch (error) {
    const errorMessage = error instanceof AxiosError && error.response?.data?.message
      ? error.response.data.message
      : "Failed to fetch achievements";
    throw new Error(errorMessage);
  }
};

export const CreateAchievement = async (formData: AchievementData): Promise<Achievement> => {
  try {
    const data = new FormData();
    data.append("achievementName", formData.achievementName);
    data.append("achieverName", formData.achieverName);
    data.append("description", formData.description);
    if (formData.session) data.append("session", formData.session);
    if (formData.link) data.append("link", formData.link);
    if (formData.achievementPicture) data.append("achievementPicture", formData.achievementPicture);
    if (formData.achieverCategory) data.append("achieverCategory", formData.achieverCategory);
    if (formData.department) data.append("department", formData.department);

    const response = await axios.post<ApiAchievement>(
      "http://localhost:3001/api/achievements",
      data,
      {
        withCredentials: true,
      }
    );
    return transformApiAchievementToAchievement(response.data);
  } catch (error) {
    const errorMessage = error instanceof AxiosError && error.response?.data?.message
      ? error.response.data.message
      : "Failed to create achievement";
    throw new Error(errorMessage);
  }
};

export const UpdateAchievement = async (formData: AchievementData, id: string): Promise<Achievement> => {
  try {
    const data = new FormData();
    data.append("achievementName", formData.achievementName);
    data.append("achieverName", formData.achieverName);
    data.append("description", formData.description);
    if (formData.session) data.append("session", formData.session);
    if (formData.link) data.append("link", formData.link);
    if (formData.achievementPicture) data.append("achievementPicture", formData.achievementPicture);
    if (formData.achieverCategory) data.append("achieverCategory", formData.achieverCategory);
    if (formData.department) data.append("department", formData.department);

    const response = await axios.put<ApiAchievement>(
      `http://localhost:3001/api/achievements/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return transformApiAchievementToAchievement(response.data);
  } catch (error) {
    const errorMessage = error instanceof AxiosError && error.response?.data?.message
      ? error.response.data.message
      : "Failed to update achievement";
    throw new Error(errorMessage);
  }
};

export const DeleteAchievement = async (id: string): Promise<string> => {
  try {
    const response = await axios.delete(`http://localhost:3001/api/achievements/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.message || "Achievement deleted successfully";
  } catch (error) {
    const errorMessage = error instanceof AxiosError && error.response?.data?.message
      ? error.response.data.message
      : "Failed to delete achievement";
    throw new Error(errorMessage);
  }
};

// Helper function to transform API response to match our frontend Achievement interface
function transformApiAchievementToAchievement(apiAchievement: ApiAchievement): Achievement {
  return {
    id: apiAchievement.id.toString(),
    achievementName: apiAchievement.achievementName,
    achieverName: apiAchievement.achieverName,
    description: apiAchievement.achievementDescription,
    session: apiAchievement.session || undefined,
    link: apiAchievement.Link || undefined,
    achievementPicture: apiAchievement.achievementPicture || undefined,
    achieverCategory: apiAchievement.achieverCategory || undefined,
    department: apiAchievement.department || undefined,
  };
}