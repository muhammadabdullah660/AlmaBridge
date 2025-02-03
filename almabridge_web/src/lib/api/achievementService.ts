import { Achievement, AchievementData, ApiAchievement } from "@/types";
import axios from "axios";



export const GetAllAchievements = async (): Promise<Achievement[]> => {
    try{
        const response = await axios.get<ApiAchievement[]>(`http://127.0.0.1:3001/api/achievements`);
        return response.data.map(transformApiAchievementToAchievement);
    } catch (error) {
        throw error;
    }
}

export const CreateAcievement = async (formData: AchievementData, token: string): Promise<Achievement> => {
    try{
      const response = await axios.post<ApiAchievement>(
        `http://127.0.0.1:3001/api/job`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
      return transformApiAchievementToAchievement(response.data);
    
    } catch(error) {
      throw error;
    }
}


export const UpdateAchievement = async (formData: AchievementData, token: string, id?: string ): Promise<Achievement> => {
    try{
      const response = await axios.put<ApiAchievement>(
        `http://127.0.0.1:3001/api/job/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
      return transformApiAchievementToAchievement(response.data);
    
    } catch(error) {
      throw error;
    }
}


export const DeleteAchievement = async (id: string, token: string): Promise<string> => {
    try{
        const response = await axios.delete(
            `http://127.0.0.1:3001:/api/achievement/${id}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                }
            }
        );
        return response.data.message;
    } catch(error) {
        throw error;
    }
}




// Helper function to transform API response to match our frontend Achivement interface
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
    department: apiAchievement.department || undefined
  };
}