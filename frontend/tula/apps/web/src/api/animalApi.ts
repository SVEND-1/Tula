import axios from "axios";
import type { Animal, CreateAnimalRequest } from "../types/animal/animal.types.ts";

const ANIMAL_API = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true
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
    return ANIMAL_API.get<AnimalPageResponse>('/animals');
};

export const getAnimalById = (id: number) => {
    return ANIMAL_API.get<Animal>(`/animals/${id}`);
};

export const getAnimalProfile = (id: number) => {
    return ANIMAL_API.get(`/animals/profile/${id}`);
};

export const createAnimalWithImage = async (
    data: CreateAnimalRequest,
    imageFile?: File
) => {
    const formData = new FormData();

    const animalData = {
        name: data.name.trim(),
        age: Number(data.age),
        description: data.description || '',
        breed: data.breed.trim(),
        gender: data.gender,
        animalType: data.animalType
    };

    formData.append(
        'animal',
        new Blob(
            [JSON.stringify(animalData)],
            { type: 'application/json' }
        )
    );

    if (imageFile) {
        formData.append('image', imageFile);
    }

    return await ANIMAL_API.post('/owners/animal', formData);
};

export const getAnimalImageUrl = async (animalId: number): Promise<string | null> => {
    try {
        const response = await ANIMAL_API.get(
            `/owners/animal-img/${animalId}`
        );

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 500) {
            console.log(`Картинка не найдена для животного ${animalId}`);
            return null;
        }

        console.error('Ошибка получения картинки:', error);
        return null;
    }
};

export const deleteAnimal = async (id: number) => {
    return await ANIMAL_API.delete(`/owners/${id}`);
};

export default ANIMAL_API;