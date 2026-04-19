import axios from "axios";

const CHAT_API = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// получить все чаты пользователя
export const getChats = () => CHAT_API.get("/chat");

// создать чат (ВАЖНО: после лайка)
export const createChat = (animalId: number) =>
    CHAT_API.post(`/chat/${animalId}`);

// получить сообщения чата
export const getMessages = (chatId: number) =>
    CHAT_API.get(`/chat-message/${chatId}`);

// отправить сообщение
export const sendMessageApi = (chatId: number, text: string) =>
    CHAT_API.post(`/chat-message/${chatId}`, {
        message: text,
    });

export default CHAT_API;