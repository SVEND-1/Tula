import axios from "axios";
import type { Animal, CreateAnimalRequest } from "../types/animal/animal.types.ts";

const API_BASE_URL = window.location.origin;

const ANIMAL_API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
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


export interface UpdateAnimalRequest {
    name: string;
    description: string;
    age: number;
}

export const updateAnimal = async (id: number, data: UpdateAnimalRequest) => {
    const token = localStorage.getItem('token');
    return await ANIMAL_API.put<Animal>(`/owners/animal/${id}`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const updateAnimalImage = async (animalId: number, imageFile: File) => {
    const formData = new FormData();
    formData.append('file', imageFile);  // ВАЖНО: ключ должен быть "file", а не "image"

    const token = localStorage.getItem('token');

    return await ANIMAL_API.patch(`/owners/animal-img/${animalId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    });
};

export default ANIMAL_API;