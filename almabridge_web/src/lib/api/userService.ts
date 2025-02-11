import axios from "axios";
import { UserDataResponse } from "@/types";


export const GetUserInfo = async (token: string): Promise<UserDataResponse> => {
    try{
        const response = await axios.get(
            `http://127.0.0.1:3001/api/user`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        const {firstName, lastName, email} = response.data;
        return {firstName, lastName, email};
    } catch(error) {
        throw error;
    }
}