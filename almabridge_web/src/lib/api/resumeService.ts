import axios from "axios";
import { ResumeData } from "@/types";

export const ResumeParser = async (file: File): Promise<ResumeData> => {
    try{
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
            `http://127.0.0.1:5001/api/resumeExtract`,
            formData, 
            {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.resume_data;

    } catch(error) {
        throw error;
    }
}