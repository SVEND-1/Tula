import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnimalProfile } from '../../api/animalApi';
import type { AnimalProfileResponse } from '../../types/animal/animal.types';

export function useAnimalDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [animal, setAnimal] = useState<AnimalProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});

    useEffect(() => {
        loadAnimal();
        loadImagesFromStorage();
    }, [id]);

    const loadImagesFromStorage = () => {
        const stored = localStorage.getItem('animalImages');
        if (stored) setAnimalImages(JSON.parse(stored));
    };

    const loadAnimal = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await getAnimalProfile(Number(id));
            setAnimal(res.data);
        } catch (error) {
            console.error('Ошибка загрузки животного:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAnimalImage = (a: AnimalProfileResponse): string | null => {
        const key = `${a.name}_${a.breed}_${a.age}`;
        return animalImages[key] || null;
    };

    const getAgeText = (age: number): string => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const getGenderIcon = (gender: string): string => gender === 'MAN' ? '♂️' : '♀️';
    const getGenderText = (gender: string): string => gender === 'MAN' ? 'Мальчик' : 'Девочка';
    const getTypeText = (type: string): string => type === 'DOG' ? 'Собака' : 'Кошка';
    const getTypeIcon = (type: string): string => type === 'DOG' ? '🐕' : '🐈';

    const formatDate = (dateString: string): string => {
        if (!dateString) return 'Не указано';
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    return {
        animal,
        isLoading,
        navigate,
        getAnimalImage,
        getAgeText,
        getGenderIcon,
        getGenderText,
        getTypeText,
        getTypeIcon,
        formatDate,
    };
}
