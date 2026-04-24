import axios from "axios";
import type {Like} from "../types/likes/like.types.ts";

const LIKE_API = axios.create({
    baseURL: "http://localhost:8080/api/likes",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

LIKE_API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Токен для запроса:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Полный URL:', config.baseURL + config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

LIKE_API.interceptors.response.use(
    (response) => {
        console.log('Ответ сервера:', response.data);
        return response;
    },
    (error) => {
        console.error('Ошибка сервера:', error.response?.data);
        return Promise.reject(error);
    }
);

export const sendLike = (animalId: number) => {
    return LIKE_API.post<Like>(`/like/${animalId}`);
};

export const sendDislike = (animalId: number) => {
    return LIKE_API.post<Like>(`/dislike/${animalId}`);
};

export const getUserLikes = () => {
    return LIKE_API.get('/user/likes');
};
export const deleteLike = (animalId: number) => {
    return LIKE_API.delete(`/${animalId}`);
};


export default LIKE_API;