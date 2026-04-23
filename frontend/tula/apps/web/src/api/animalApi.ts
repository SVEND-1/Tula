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

// ========== СОЗДАНИЕ ЖИВОТНОГО С КАРТИНКОЙ ==========
export const createAnimalWithImage = async (data: CreateAnimalRequest, imageFile?: File) => {
    const token = localStorage.getItem('token');

    console.log('=== ДИАГНОСТИКА ТОКЕНА ===');
    console.log('Токен существует:', !!token);
    console.log('Токен (первые 30 символов):', token ? token.substring(0, 30) + '...' : 'ОТСУТСТВУЕТ');

    if (!token) {
        alert('Сессия истекла. Пожалуйста, войдите заново.');
        throw new Error('Нет токена авторизации');
    }

    const formData = new FormData();

    const animalData = {
        name: data.name.trim(),
        age: Number(data.age),
        description: data.description || '',
        breed: data.breed.trim(),
        gender: data.gender,
        animalType: data.animalType
    };

    const animalBlob = new Blob([JSON.stringify(animalData)], { type: 'application/json' });
    formData.append('animal', animalBlob);

    if (imageFile) {
        const imageBlob = new Blob([imageFile], { type: imageFile.type });
        formData.append('image', imageBlob);
    }

    // Для отладки: посмотрим содержимое FormData
    for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1] instanceof Blob ? `Blob (${pair[1].size} bytes, type: ${pair[1].type})` : pair[1]);
    }

    console.log('=== ОТПРАВКА ЗАПРОСА ===');
    console.log('URL:', 'http://localhost:8080/api/owners/animal');
    console.log('Authorization header:', `Bearer ${token.substring(0, 30)}...`);

    try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8080/api/owners/animal',
            data: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        console.log('=== ОТВЕТ ===');
        console.log('Статус:', response.status);
        console.log('Данные:', response.data);

        return response;
    } catch (error: any) {
        console.error('=== ОШИБКА ЗАПРОСА ===');
        console.error('Статус:', error.response?.status);
        console.error('Данные ошибки:', error.response?.data);
        console.error('Заголовки запроса:', error.config?.headers);
        throw error;
    }
};

// Получение URL картинки животного
export const getAnimalImageUrl = async (animalId: number): Promise<string | null> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

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

export default ANIMAL_API;