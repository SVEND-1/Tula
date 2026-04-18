export type Gender = 'MAN' | 'WOMAN';
export type AnimalType = 'DOG' | 'CAT';
export type StatusAnimal = 'AVAILABLE' | 'TAKEN' | 'VERIFICATION';

export interface Animal {
    id?: number;
    name: string;
    age: number;
    description: string;
    breed: string;
    gender: Gender;
    animalType: AnimalType;
    status: StatusAnimal;
    personTakeId: number | null;
    photoUrl?: string;
}

export interface CreateAnimalRequest {
    name: string;
    age: number;
    description: string;
    breed: string;
    gender: Gender;
    animalType: AnimalType;
}