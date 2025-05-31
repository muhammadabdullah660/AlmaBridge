import axios from "axios";
import { UserDataResponse } from "@/types";

axios.defaults.withCredentials = true;

export const GetUserInfo = async (): Promise<UserDataResponse> => {
    try{
        const response = await axios.get(
            `http://localhost:3001/api/user`,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const {firstName, lastName, email} = response.data;
        return {firstName, lastName, email};
    } catch(error) {
        throw error;
    }
}