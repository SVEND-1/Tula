import axios from "axios";
import type { Animal, CreateAnimalRequest } from "../types/animal/animal.types.ts";

const ANIMAL_API = axios.create({
    baseURL: "http://localhost:8080/api/animals",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем токен
ANIMAL_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createAnimal = (data: CreateAnimalRequest) => {
    const cleanData = {
        name: data.name.trim(),
        age: Number(data.age),
        description: data.description || '',
        breed: data.breed.trim(),
        gender: data.gender,
        animalType: data.animalType
    };
    return ANIMAL_API.post<Animal>('', cleanData);
};

export const getAllAnimals = () => {
    // Используем эндпоинт /api/animals (без /feed)
    return ANIMAL_API.get<Animal[]>('');
};

export const getAnimalById = (id: number) =>
    ANIMAL_API.get<Animal>(`/${id}`);

export const getAnimalProfile = (id: number) =>
    ANIMAL_API.get(`/profile/${id}`);

export const rejectTakenAnimal = (id: number) =>
    ANIMAL_API.put<string>(`/rejection/${id}`);

export const confirmTakenAnimal = (id: number) =>
    ANIMAL_API.put<string>(`/confirm/${id}`);

export default ANIMAL_API;