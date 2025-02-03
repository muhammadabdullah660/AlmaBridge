import axios from "axios"

export const UpdateProfile = async (formData: FormData, token: string): Promise<string> => {
    try{
        const response = await axios.post(
            `http://127.0.0.1:3001/api/profile`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response.data.message;
    } catch(error){
        throw error;
    }
}