const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });


const WORKER_URL = process.env.WORKER_URL;



const checkFileName = (sendingFileName, savedFileName) => {
    const match = savedFileName.match(/\/([^/]+)$/);
    const actualFileName = match[1].substring(match[1].indexOf('_') + 1);
  
    return sendingFileName === actualFileName ? true : false;
};


// Function to upload a file
const uploadFile = async (file, userId, folderName) => {
    const formData = new FormData();

    const bolb = new Blob([file.buffer], {type: file.mimetype});
    formData.append("file", bolb, file.originalname);
    formData.append("userId", userId);
    formData.append("folderName", folderName);
  
    try {
      const response = await axios.post(`${WORKER_URL}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...formData.getHeaders?.(),
        },
        transformRequest: (data, headers) => {
          return data;
        },
      });
  
      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data.filePath);
        return response.data.filePath;
      } else {
        console.error("File upload failed:", response.statusText);
        throw new Error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      throw new Error("Error uploading file.");
    }
};
  
// Function to delete a file
const deleteFile = async (filePath) => {
    try {
        const response = await axios.delete(`${process.env.WORKER_URL}delete`, {
        data: { filePath },
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (response.status === 200) {
        console.log("File deleted successfully:", filePath);
        } else {
        console.error("Failed to delete file:", response.statusText);
        throw new Error("Failed to delete the existing file.");
        }
    } catch (error) {
        console.error("Error deleting file:", error.message);
        throw new Error("Error deleting the existing file.");
    }
};


module.exports = { checkFileName, uploadFile, deleteFile };