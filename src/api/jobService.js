import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/jobs";

// Helper: builds the Authorization header using the token saved at login
const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const jobService = {
  // GET all jobs
  getAllJobs: async () => {
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    return response.data;
  },

  // GET job by ID
  getJobById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  // POST a new job
  createJob: async (jobData) => {
    const response = await axios.post(API_BASE_URL, jobData, getAuthHeaders());
    return response.data;
  },

  // PUT (update) a job
  updateJob: async (id, jobData) => {
    const response = await axios.put(
      `${API_BASE_URL}/${id}`,
      jobData,
      getAuthHeaders(),
    );
    return response.data;
  },

  // DELETE a job
  deleteJob: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  },
};
