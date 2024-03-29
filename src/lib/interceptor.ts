import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://29a1-2407-aa80-14-39e-4c80-e73d-b2ce-84d2.ngrok-free.app",
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
});

axiosInstanceLocal.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            error.response.data.message === "jwt expired"
        ) {
            try {
                await axiosInstance.post(`/api/auth/refresh`);
                return await axiosInstance(originalRequest);
            } catch (err) {
                console.log(err);
            }
        }

        return Promise.reject(error);
    }
);

export const httpRequestLocal = axiosInstanceLocal;
