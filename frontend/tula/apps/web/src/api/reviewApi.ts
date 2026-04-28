import axios from "axios";

const API_BASE_URL = window.location.origin;

const REVIEW_API = axios.create({
    baseURL: `${API_BASE_URL}/api/reviews`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

REVIEW_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Review {
    id: number;
    content: string;
    createdAt: string;
}

export interface CreateReviewRequest {
    content: string;
    ownerId: number;
}

export const getReviewsByOwnerId = (ownerId: number) => {
    return REVIEW_API.get<Review[]>(`/owner/${ownerId}`);
};

export const addReview = (data: CreateReviewRequest) => {
    return REVIEW_API.post<Review>('', data);
};

export default REVIEW_API;