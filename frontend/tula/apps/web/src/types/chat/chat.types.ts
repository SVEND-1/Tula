export interface Message {
    id: number | string;
    from: 'in' | 'out';
    text: string;
    time: string;
}

export interface PetChat {
    id: number;
    name: string;
    breed: string;
    emoji: string;
    preview: string;
    time: string;
    unread: number;
    messages: Message[];
    animalId: number;
    sellerId: number;
    buyerId: number;
}