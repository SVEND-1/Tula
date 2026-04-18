import axios from "axios";
import type { CreateAnimalRequest } from '../types/animal/animal.types';

const OWNER_API = axios.create({
    baseURL: "http://localhost:8080/api/owners",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

OWNER_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Animal {
    id: number;
    name: string;
    age: number;
    description: string;
    breed: string;
    gender: 'MAN' | 'WOMAN';
    animalType: 'DOG' | 'CAT';
    status: string;
}

export interface Review {
    id: number;
    content: string;
    createdAt: string;
    authorName?: string;
}

export interface OwnerProfileResponse {
    name: string;
    animals: Animal[];
    reviews: Review[];
}

export const createOwner = (name: string) => {
    return OWNER_API.post<string>(`?name=${encodeURIComponent(name)}`);
};

export const getOwnerAnimals = () => {
    return OWNER_API.get<Animal[]>('/animal');
};

export const createOwnerAnimal = (data: CreateAnimalRequest) => {
    return OWNER_API.post<Animal>('/animal', data);
};

export const getOwnerProfile = (id: number) => {
    return OWNER_API.get<OwnerProfileResponse>(`/${id}`);
};
export const deleteOwnerAnimal = (animalId: number) => {
    return OWNER_API.delete(`/animal/${animalId}`);
};
export default OWNER_API;