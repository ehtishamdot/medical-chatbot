import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { redirect } from "next/navigation";

import TokenService from "@/services/token/token.service";
import Cookies from "js-cookie";

export const axiosInstanceLocal = axios.create({
    baseURL: "",
    withCredentials:true
});

const requestHandler = async (request: InternalAxiosRequestConfig) => {
    console.log("asdasd")
    const token = Cookies.get("refreshToken");
    request.headers["Authorization"] = `Bearer ${token}`;
    request.timeout = 60000;
    return request;
};

const responseHandler = async (response: AxiosResponse) => {
    const token = TokenService.getLocalRefreshToken();
    response.headers["Authorization"] = `Bearer ${token}`;

    return response;
};
const errorHandler = async (err: any) => {
    const originalConfig = err.config;

    return Promise.reject(err);
};

const setup = () => {
    axiosInstanceLocal.interceptors.request.use(
        (request: InternalAxiosRequestConfig) => requestHandler(request),
        (error: AxiosError) => Promise.reject(error),
    );

    axiosInstanceLocal.interceptors.response.use(
        (response: AxiosResponse) => responseHandler(response),
        (error: AxiosError) => errorHandler(error),
    );
};

export default setup;
