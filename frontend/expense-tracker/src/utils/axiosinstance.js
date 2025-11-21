import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

//request interceptor
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`;
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    // Runs when request is successful
    console.log("Response intercepted:", response.data);

    // You can modify response if needed
    return response;
  },
  (error) => {
    // Runs when server sends an error
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized. Maybe refresh token or logout.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
