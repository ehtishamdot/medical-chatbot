import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import Cookies from "js-cookie";
const axiosInstance = axios.create({
  baseURL: "https://76f7-52-23-237-5.ngrok-free.app",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.message === "jwt expired" &&
      !originalRequest._retry // Ensure that the request is not retried multiple times
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token by making a request to the refresh endpoint
        const refreshResponse = await axiosInstance.post("/api/auth/refresh");
        const newAccessToken = refreshResponse.data.accessToken;

        // Update the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return await axiosInstance(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, redirect the user to the login page
        console.log("Token refresh failed:", refreshError);
        // Redirect to login page or handle the expired token scenario as needed
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);
export const httpRequest = axiosInstance;

const axiosInstanceLocal = axios.create({
  baseURL: "",
    withCredentials:true
});

const requestHandler = async (request: InternalAxiosRequestConfig) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const token = Cookies.get("refreshToken");
    if (token) {
        console.log("refreshToken")
        request.headers["Authorization"] = `Bearer ${token}`;
    }
    request.timeout = 60000;
    return request;
};
axiosInstanceLocal.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => requestHandler(request),
    (error: AxiosError) => Promise.reject(error),
);
axiosInstanceLocal.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            error.response.data.message === "jwt expired" &&
            !originalRequest._retry // Ensure that the request is not retried multiple times
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token by making a request to the refresh endpoint
                const refreshResponse = await axiosInstance.post("/api/auth/refresh");
                const newAccessToken = refreshResponse.data.refresh_token;

                // Update the original request with the new token
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                // Retry the original request with the new token
                return await axiosInstance(originalRequest);
            } catch (refreshError) {
                // If token refresh fails, redirect the user to the login page
                console.log("Token refresh failed:", refreshError);
                // Redirect to login page or handle the expired token scenario as needed
                window.location.href = "/auth/login";
            }
        }

        return Promise.reject(error);
    }
);
// axiosInstanceLocal.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response.status === 401 &&
//       error.response.data.message === "jwt expired"
//     ) {
//       try {
//         await axiosInstance.post(`/api/auth/refresh`);
//         return await axiosInstance(originalRequest);
//       } catch (err) {
//         console.log(err);
//       }
//     }
//
//     return Promise.reject(error);
//   }
// );

export const httpRequestLocal = axiosInstanceLocal;
