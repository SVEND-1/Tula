import axios from "axios";
import type { CreateAnimalRequest } from '../types/animal/animal.types';

const OWNER_API = axios.create({
    baseURL: "http://localhost:8080/api",
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

export interface OwnerProfileResponse {
    name: string;
    animals: Animal[];
    reviews: any[];
}

export const createOwner = (name: string) => {
    return OWNER_API.post<string>(`/owners?name=${encodeURIComponent(name)}`);
};

export const getOwnerAnimals = () => {
    return OWNER_API.get<Animal[]>('/owners/animal');
};

export const createOwnerAnimal = (data: CreateAnimalRequest) => {
    return OWNER_API.post<Animal>('/owners/animal', data);
};

export const getOwnerProfile = (ownerId: number) => {
    return OWNER_API.get<OwnerProfileResponse>(`/owners/${ownerId}`);
};

export const uploadAnimalImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    const response = await axios.post(
        `http://localhost:8080/api/files/upload/pet-images`,
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    return response;
};

export const getAnimalImageUrl = async (animalId: number): Promise<string | null> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `http://localhost:8080/api/owners/animal-img/${animalId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 500) {
            console.log(`Картинка не найдена для животного ${animalId}`);
            return null;
        }
        console.error(`Ошибка при получении картинки:`, error);
        return null;
    }
};
export default OWNER_API;