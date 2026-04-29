import axios from 'axios';
import type { VideoResponse, CommentResponse, PageResponse } from '../types/video/video.types';

const API_BASE_URL = window.location.origin;

const VIDEO_API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

VIDEO_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

VIDEO_API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Video API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export const videoApi = {
    getAll: (page: number, size = 10) =>
        VIDEO_API.get<PageResponse>('/videos', { params: { page, size } }),

    upload: (title: string, description: string, file: File) => {
        const fd = new FormData();
        fd.append('title', title);
        fd.append('description', description);
        fd.append('file', file);
        return VIDEO_API.post<VideoResponse>('/videos/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getStreamUrl: (id: number) => `${API_BASE_URL}/api/videos/${id}/stream`,

    toggleLike: (id: number) => VIDEO_API.post(`/videos/${id}/like`),

    addComment: (id: number, text: string) =>
        VIDEO_API.post<CommentResponse>(`/videos/${id}/comments`, { text }),

    deleteComment: (commentId: number) => VIDEO_API.delete(`/videos/comments/${commentId}`),

    deleteVideo: (id: number) => VIDEO_API.delete(`/videos/${id}`),
};

export default VIDEO_API;
