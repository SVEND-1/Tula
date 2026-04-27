import axios from "axios";

const API_BASE_URL = window.location.origin;

const FOLLOW_API = axios.create({
    baseURL: `${API_BASE_URL}/api/follows`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

FOLLOW_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Follow {
    id?: number;
    ownerName?: string;
    ownerId?: number;
    userId?: number;
    createAt?: string;
    [key: string]: any;
}

export const getFollowersCount = (ownerId: number) => {
    return FOLLOW_API.get<number>(`/counter/${ownerId}`);
};

export const getUserFollows = () => {
    return FOLLOW_API.get<Follow[]>('');
};

export const createFollow = (ownerId: number) => {
    return FOLLOW_API.post<string>(`/${ownerId}`);
};

export const deleteFollow = (followId: number) => {
    return FOLLOW_API.delete<string>(`/${followId}`);
};

export const getFollowById = (followId: number) => {
    return FOLLOW_API.get<Follow>(`/${followId}`);
};

export const getOwnerByFollowId = (followId: number) => {
    return FOLLOW_API.get(`/owner/${followId}`);
};

export default FOLLOW_API;