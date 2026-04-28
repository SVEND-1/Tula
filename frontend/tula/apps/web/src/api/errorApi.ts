import axios from "axios";
import type { ApiError } from "../types/error.types";

const API_BASE_URL = window.location.origin;

export const errorApi = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

errorApi.interceptors.response.use(
    (response) => response,
    (error) => {
        const apiError: ApiError = {
            status: error.response?.status || 500,
            data: error.response?.data || {
                message: "Ошибка сервера",
                errorMessage: error.message,
                errorTime: new Date().toISOString(),
            },
        };

        return Promise.reject(apiError);
    }
);