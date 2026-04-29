import axios from 'axios';
import type { VideoResponse, CommentResponse, PageResponse } from '../types/video/video.types';

const API = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export const videoApi = {
    getAll: (page: number, size = 10) =>
        API.get<PageResponse>('/videos', { params: { page, size } }),

    upload: (title: string, description: string, file: File) => {
        const fd = new FormData();
        fd.append('title', title);
        fd.append('description', description);
        fd.append('file', file);
        return API.post<VideoResponse>('/videos/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    toggleLike: (id: number) => API.post(`/videos/${id}/like`),

    addComment: (id: number, text: string) =>
        API.post<CommentResponse>(`/videos/${id}/comments`, { text }),

    deleteComment: (commentId: number) => API.delete(`/videos/comments/${commentId}`),

    deleteVideo: (id: number) => API.delete(`/videos/${id}`),
};

export default API;