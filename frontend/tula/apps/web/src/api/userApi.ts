import axios from "axios";

const API_BASE_URL = window.location.origin;

const USER_API = axios.create({
    baseURL: `${API_BASE_URL}/api/users`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

USER_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface UserProfileResponse {
    name: string;
    email: string;
    likeAnimals: Animal[];
    myAnimals: Animal[];
    myReview: Review[];
}

export interface Animal {
    id: number;
    name: string;
    age: number;
    description: string;
    breed: string;
    gender: 'MAN' | 'WOMAN';
    animalType: 'DOG' | 'CAT';
    status: 'AVAILABLE' | 'TAKEN' | 'VERIFICATION';
    personTakeId: number | null;
    createAt: string;
}

export interface Review {
    id: number;
    content: string;
    createdAt: string;
}

export const getUserProfile = () => {
    return USER_API.get<UserProfileResponse>('');
};

export default USER_API;