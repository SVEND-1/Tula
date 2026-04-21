import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, type UserProfileResponse, type Animal } from '../../api/userApi';
import { createOwner, getOwnerAnimals, createOwnerAnimal } from '../../api/ownerApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types';

export interface LikedAnimal {
    id: number;
    name: string;
    breed: string;
    age: number;
    description: string;
    gender: string;
    animalType: string;
    status: string;
    likedAt: string;
}

export interface MyAnimal {
    id: number;
    name: string;
    breed: string;
    age: number;
    description: string;
    gender: string;
    animalType: string;
    status: string;
}

export type ActiveTab = 'profile' | 'mypets' | 'reviews' | 'liked' | 'createShelter';

export const FACTS = [
    { text: "🐱 Кошки спят около 16 часов в день", emoji: "😴" },
    { text: "🐶 Собаки понимают до 250 слов и жестов", emoji: "🧠" },
    { text: "🐱 Коты могут издавать около 100 различных звуков", emoji: "🎵" },
    { text: "🐶 Нос собаки уникален, как отпечаток пальца", emoji: "👃" },
    { text: "🐱 Кошки не чувствуют сладкий вкус", emoji: "🍬" },
    { text: "🐶 Собаки видят сны так же, как люди", emoji: "💭" },
    { text: "🐱 У кошек 32 мышцы в каждом ухе", emoji: "👂" },
    { text: "🐶 Хвост собаки показывает её настроение", emoji: "🐕" },
    { text: "🐱 Кошки мурлыкают на частоте, которая помогает заживлению костей", emoji: "💚" },
    { text: "🐶 Собаки могут чувствовать магнитное поле Земли", emoji: "🧲" },
    { text: "🐱 Кошка может прыгнуть в 6 раз выше своего роста", emoji: "🦘" },
    { text: "🐶 Собаки понимают человеческие эмоции по голосу", emoji: "❤️" },
    { text: "🐱 Усы помогают кошкам ориентироваться в темноте", emoji: "🌙" },
    { text: "🐶 Собаки бегают зигзагами, чтобы сбросить напряжение", emoji: "⚡" },
];

export function useLikedAnimals() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [likedAnimals, setLikedAnimals] = useState<LikedAnimal[]>([]);
    const [myAnimals, setMyAnimals] = useState<MyAnimal[]>([]);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [isCreatingAnimal, setIsCreatingAnimal] = useState(false);
    const [shelterName, setShelterName] = useState('');
    const [isCreatingShelter, setIsCreatingShelter] = useState(false);
    const [hasOwner, setHasOwner] = useState(false);
    const [ownerName, setOwnerName] = useState('');
    const [currentFact, setCurrentFact] = useState(0);

    useEffect(() => {
        // Разрешаем скролл на этой странице
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        loadProfile();
        loadImagesFromStorage();
        checkOwner();
        loadMyAnimals();

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    // Факты о животных — меняем каждые 8 сек
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFact(prev => (prev + 1) % FACTS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const loadImagesFromStorage = () => {
        const stored = localStorage.getItem('animalImages');
        if (stored) setAnimalImages(JSON.parse(stored));
    };

    const checkOwner = async () => {
        try {
            const res = await getOwnerAnimals();
            if (res.data && res.status === 200) setHasOwner(true);
        } catch {
            setHasOwner(false);
            setOwnerName('');
        }
    };

    const loadMyAnimals = async () => {
        try {
            const res = await getOwnerAnimals();
            const animals = (res.data ?? []).map((a: any) => ({
                id: a.id,
                name: a.name,
                breed: a.breed,
                age: a.age,
                description: a.description,
                gender: a.gender,
                animalType: a.animalType,
                status: a.status,
            }));
            setMyAnimals(animals);
        } catch (error) {
            console.error('Ошибка загрузки моих животных:', error);
            setMyAnimals([]);
        }
    };

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const res = await getUserProfile();
            setProfile(res.data);

            if (res.data.likeAnimals) {
                setLikedAnimals(res.data.likeAnimals.map(a => ({
                    id: a.id,
                    name: a.name,
                    breed: a.breed,
                    age: a.age,
                    description: a.description,
                    gender: a.gender,
                    animalType: a.animalType,
                    status: a.status,
                    likedAt: a.createAt,
                })));
            }

            if (res.data.name) setOwnerName(res.data.name);
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            // Фолбэк — берём лайки из localStorage
            const stored = localStorage.getItem('likedAnimals');
            if (stored) setLikedAnimals(JSON.parse(stored));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateShelter = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingShelter(true);
        try {
            await createOwner(shelterName);
            setOwnerName(shelterName);
            setShelterName('');
            setHasOwner(true);
            setActiveTab('mypets');
            alert('✅ Приют успешно создан! Теперь вы можете добавлять питомцев');
        } catch (error) {
            console.error('Ошибка создания приюта:', error);
            alert('❌ Ошибка создания приюта');
        } finally {
            setIsCreatingShelter(false);
        }
    };

    const handleCreateAnimal = async (data: CreateAnimalRequest, imageBase64?: string) => {
        setIsCreatingAnimal(true);
        try {
            const res = await createOwnerAnimal(data);

            if (res.data) {
                // Сохраняем картинку по id и по составному ключу
                const stored = localStorage.getItem('animalImages');
                const images = stored ? JSON.parse(stored) : {};
                const uniqueKey = `${res.data.name}_${res.data.breed}_${res.data.age}`;
                images[res.data.id] = imageBase64 || '';
                images[uniqueKey] = imageBase64 || '';
                localStorage.setItem('animalImages', JSON.stringify(images));
                setAnimalImages(images);

                alert(`✅ Животное "${res.data.name}" успешно создано! Оно появится в ленте`);
                await loadMyAnimals();
                await loadProfile();
                setActiveTab('mypets');
            }
        } catch (error: any) {
            console.error('Ошибка создания животного:', error);
            alert(`❌ ${error.response?.data?.message || 'Ошибка создания анкеты'}`);
        } finally {
            setIsCreatingAnimal(false);
        }
    };

    // Ищем картинку сначала по id, потом по составному ключу, потом по совпадению в имени
    const getAnimalImage = (animal: LikedAnimal | MyAnimal | Animal): string | null => {
        if (animalImages[animal.id]) return animalImages[animal.id];
        const key = `${animal.name}_${animal.breed}_${animal.age}`;
        if (animalImages[key]) return animalImages[key];
        const fallback = Object.entries(animalImages).find(
            ([k]) => k.includes(String(animal.id)) || k.includes(animal.name)
        );
        return fallback?.[1] ?? null;
    };

    // Убираем дубликаты лайков по id
    const uniqueLikedAnimals = useMemo(() => {
        const seen = new Set<number>();
        return likedAnimals.filter(a => {
            if (seen.has(a.id)) return false;
            seen.add(a.id);
            return true;
        });
    }, [likedAnimals]);

    const getAgeText = (age: number): string => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const getGenderIcon = (gender: string): string => gender === 'MAN' ? '♂️' : '♀️';
    const getGenderText = (gender: string): string => gender === 'MAN' ? 'Мальчик' : 'Девочка';

    const formatDate = (dateString: string): string => {
        if (!dateString) return 'Не указано';
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
        });
    };

    const STATUS_LABELS: Record<string, string> = {
        AVAILABLE: 'Доступен',
        TAKEN: 'Забран',
        VERIFICATION: 'На проверке',
    };

    const STATUS_CLASSES: Record<string, string> = {
        AVAILABLE: 'available',
        TAKEN: 'taken',
        VERIFICATION: 'verification',
    };

    const getStatusText = (status: string): string => STATUS_LABELS[status] ?? status;
    const getStatusClass = (status: string): string => STATUS_CLASSES[status] ?? '';

    return {
        profile,
        likedAnimals,
        myAnimals,
        isLoading,
        activeTab,
        isCreatingAnimal,
        shelterName,
        isCreatingShelter,
        hasOwner,
        ownerName,
        currentFact,
        uniqueLikedAnimals,
        navigate,
        setActiveTab,
        setShelterName,
        handleCreateShelter,
        handleCreateAnimal,
        getAnimalImage,
        getAgeText,
        getGenderIcon,
        getGenderText,
        formatDate,
        getStatusText,
        getStatusClass,
    };
}
