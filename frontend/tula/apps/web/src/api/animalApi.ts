import axios from "axios";
import type { Animal, CreateAnimalRequest } from "../types/animal/animal.types.ts";

const ANIMAL_API = axios.create({
    baseURL: "http://localhost:8080/api/animals",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

ANIMAL_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface AnimalPageResponse {
    content: Animal[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export const getAllAnimals = () => {
    return ANIMAL_API.get<AnimalPageResponse>('');
};

export const getAnimalById = (id: number) =>
    ANIMAL_API.get<Animal>(`/${id}`);

export const getAnimalProfile = (id: number) =>
    ANIMAL_API.get(`/profile/${id}`);

export const createAnimalWithImage = async (data: CreateAnimalRequest, imageFile?: File) => {
    const token = localStorage.getItem('token');

    const formData = new FormData();

    const animalData = {
        name: data.name.trim(),
        age: Number(data.age),
        description: data.description || '',
        breed: data.breed.trim(),
        gender: data.gender,
        animalType: data.animalType
    };

    formData.append('animal', JSON.stringify(animalData));

    if (imageFile) {
        formData.append('image', imageFile);
    }

    const response = await axios.post(
        'http://localhost:8080/api/owners/animal',
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`
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

export const deleteAnimal = async (id: number) => {
    const token = localStorage.getItem('token');

    const response = await axios.delete(
        `http://localhost:8080/api/owners/${id}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return response;
};

export default ANIMAL_API;