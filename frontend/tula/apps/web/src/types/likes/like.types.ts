export type StatusLike = 'LIKE' | 'DISLIKE';

export interface Like {
    id: number;
    status: StatusLike;
    userId: number;
    animalId: number;
    createdAt: string;
}