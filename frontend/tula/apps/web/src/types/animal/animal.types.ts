export interface Animal {
    id: number;
    name: string;
    age: number;
    description: string;
    breed: string;
    gender: 'MAN' | 'WOMAN';
    animalType: 'DOG' | 'CAT';
    status: 'AVAILABLE' | 'TAKEN' | 'VERIFICATION';
    imageUrl?: string;
    ownerId?: number;
    ownerName?: string;
    createdAt?: string;
}

export interface AnimalProfileResponse {
    name: string;
    age: number;
    description: string;
    breed: string;
    gender: 'MAN' | 'WOMAN';
    animalType: 'DOG' | 'CAT';
    ownerName: string;
    ownerId: number;
    createAt: string;
}

export type Gender = 'MAN' | 'WOMAN';
export type AnimalType = 'DOG' | 'CAT';

export interface CreateAnimalRequest {
    name: string;
    age: number;
    description: string;
    breed: string;
    gender: Gender;
    animalType: AnimalType;
}