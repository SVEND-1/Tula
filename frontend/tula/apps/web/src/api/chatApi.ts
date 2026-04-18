import axios from "axios";

const CHAT_API = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

CHAT_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Типы данных
export interface UserDefaultResponse {
    id: number;
    name: string;
    email: string;
}

export interface AnimalResponseForChat {
    id: number;
    name: string;
    breed: string;
    age: number;
    gender: string;
    animalType: string;
    imageUrl?: string;
}

export interface ChatResponse {
    id: number;
    seller: UserDefaultResponse;
    buyer: UserDefaultResponse;
    animal: AnimalResponseForChat;
    createdAt: string;
    updatedAt: string;
}

export interface ChatMessageResponse {
    id: number;
    message: string;
    fromUser: UserDefaultResponse;
    createdAt: string;
}

// Создать чат по ID животного
export const createChat = (animalId: number) => {
    return CHAT_API.post<ChatResponse>(`/chat/${animalId}`);
};

// Получить все чаты пользователя
export const getAllChats = (pageSize?: number, pageNum?: number) => {
    return CHAT_API.get<ChatResponse[]>(`/chat`, {
        params: { pageSize, pageNum }
    });
};

// Получить чат по ID
export const getChatById = (chatId: number) => {
    return CHAT_API.get<ChatResponse>(`/chat/${chatId}`);
};

// Отправить сообщение
export const sendMessage = (chatId: number, message: string) => {
    return CHAT_API.post<ChatMessageResponse>(`/chat-message/${chatId}`, { message });
};

// Получить все сообщения чата
export const getMessages = (chatId: number, pageSize?: number, pageNum?: number) => {
    return CHAT_API.get<ChatMessageResponse[]>(`/chat-message/${chatId}`, {
        params: { pageSize, pageNum }
    });
};

// Получить последнее сообщение чата
export const getLastMessage = (chatId: number) => {
    return CHAT_API.get<ChatMessageResponse>(`/chat-message/last-message/${chatId}`);
};

export default CHAT_API;