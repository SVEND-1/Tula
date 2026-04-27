import axios from "axios";

const SUBSCRIPTION_API = axios.create({
    baseURL: "/api/subscription",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

SUBSCRIPTION_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(' Запрос подписки:', config.baseURL + config.url);
    return config;
});

SUBSCRIPTION_API.interceptors.response.use(
    (response) => {
        console.log(' Ответ подписки:', response.data);
        return response;
    },
    (error) => {
        console.error(' Ошибка подписки:', error.response?.data);
        return Promise.reject(error);
    }
);

export const createSubscription = (paymentId: string) => {
    return SUBSCRIPTION_API.post<string>(`/${paymentId}`);
};

export default SUBSCRIPTION_API;