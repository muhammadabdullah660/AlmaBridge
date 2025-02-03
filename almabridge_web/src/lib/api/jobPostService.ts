import axios from 'axios';
import { Job, ApiJob, JobData } from '@/types';



export const GetAllJobs = async (): Promise<Job[]>  => {
  try {
    const response = await axios.get<ApiJob[]>(`http://127.0.0.1:3001/api/jobs`);
    return response.data.map(transformApiJobToJob);
  } catch (error) {
    throw error;
  }
}

export const GetJobById = async (id: string): Promise<Job> => {
  try {
      const response = await axios.get<ApiJob>(`http://127.0.0.1:3001/api/job/${id}`);
      return transformApiJobToJob(response.data);
  } catch (error) {
      console.error(`Error fetching job with id ${id}:`, error);
      throw error;
  }
}


export const CreateJob = async (formData: JobData, token: string): Promise<Job> => {
  try{
    const response = await axios.post<ApiJob>(
      `http://127.0.0.1:3001/api/job`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      }
    );
    return transformApiJobToJob(response.data);
  
  } catch(error) {
    throw error;
  }
}


export const UpdateJob = async (formData: JobData, token: string, id?: string ): Promise<Job> => {
  try{
    const response = await axios.put<ApiJob>(
      `http://127.0.0.1:3001/api/job/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      }
    );
    return transformApiJobToJob(response.data);
  
  } catch(error) {
    throw error;
  }
}


export const DeleteJob = async (id: string, token: string): Promise<string> => {
  try{
    const response = await axios.delete(
      `http://127.0.0.1:3001/api/job/${id}`,
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





// export const JobService = {
//   // Get all jobs
//   async getAllJobs(): Promise<Job[]> {
//     try {
//       const response = await axios.get<ApiJob[]>(BASE_URL);
//       return response.data.map(transformApiJobToJob);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       throw error;
//     }
//   },

//   // Get a single job by ID
//   async getJobById(id: string): Promise<Job> {
//     try {
//       const response = await axios.get<ApiJob>(`${BASE_URL}/${id}`);
//       return transformApiJobToJob(response.data);
//     } catch (error) {
//       console.error(`Error fetching job with id ${id}:`, error);
//       throw error;
//     }
//   },

//   // Get jobs created by a specific user
//   async getJobsByUserId(userId: number): Promise<Job[]> {
//     try {
//       const response = await axios.get<ApiJob[]>(`${BASE_URL}/user/${userId}`);
//       return response.data.map(transformApiJobToJob);
//     } catch (error) {
//       console.error(`Error fetching jobs for user ${userId}:`, error);
//       throw error;
//     }
//   },

//   // Create a new job
//   async createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
//     try {
//       const response = await axios.post<ApiJob>(BASE_URL, jobData);
//       return transformApiJobToJob(response.data);
//     } catch (error) {
//       console.error('Error creating job:', error);
//       throw error;
//     }
//   },

//   // Update an existing job
//   async updateJob(id: string, jobData: Partial<Omit<Job, 'id'>>): Promise<Job> {
//     try {
//       const response = await axios.put<ApiJob>(`${BASE_URL}/${id}`, jobData);
//       return transformApiJobToJob(response.data);
//     } catch (error) {
//       console.error(`Error updating job ${id}:`, error);
//       throw error;
//     }
//   },

//   // Delete a job
//   async deleteJob(id: string): Promise<void> {
//     try {
//       await axios.delete(`${BASE_URL}/${id}`);
//     } catch (error) {
//       console.error(`Error deleting job ${id}:`, error);
//       throw error;
//     }
//   }
// };

// Helper function to transform API response to match our frontend Job interface
function transformApiJobToJob(apiJob: ApiJob): Job {
  return {
    id: apiJob.id.toString(),
    jobName: apiJob.jobName,
    jobDescription: apiJob.jobDescription,
    salaryRange: apiJob.salaryRange || undefined,
    location: apiJob.location || undefined,
    jobType: apiJob.jobType || undefined
  };
}
