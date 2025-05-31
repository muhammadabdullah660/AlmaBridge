import axios from "axios"
axios.defaults.withCredentials = true;

export const UpdateProfile = async (formData: FormData): Promise<string> => {
    try{
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