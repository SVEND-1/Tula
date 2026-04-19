import axios from "axios";

const LIKE_API = axios.create({
    baseURL: "http://localhost:8080/api/likes",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const sendLike = (animalId: number) => {
    return LIKE_API.post(`/like/${animalId}`);
};

export const sendDislike = (animalId: number) => {
    return LIKE_API.post(`/dislike/${animalId}`);
};

export default LIKE_API;