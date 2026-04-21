import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAnimals } from '../../api/animalApi';
import { sendLike, sendDislike } from '../../api/likeApi';
import type { Animal } from '../../types/animal/animal.types';

const HINT_TIMEOUT = 5000;      // подсказка исчезает через 5 сек
const TOAST_DURATION = 2000;    // тост исчезает через 2 сек
const SWIPE_ANIMATION = 900;    // длительность анимации свайпа

export function useMain() {
    const navigate = useNavigate();

    const [animals, setAnimals] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeClass, setSwipeClass] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});

    useEffect(() => {
        loadAnimals();
        loadImagesFromStorage();

        // Скрываем подсказку по свайпу через 5 сек
        const timer = setTimeout(() => setShowHint(false), HINT_TIMEOUT);
        return () => clearTimeout(timer);
    }, []);

    const loadImagesFromStorage = () => {
        const stored = localStorage.getItem('animalImages');
        if (stored) setAnimalImages(JSON.parse(stored));
    };

    const loadAnimals = async () => {
        setIsLoading(true);
        try {
            const res = await getAllAnimals();
            setAnimals(res.data ?? []);
        } catch (error: any) {
            console.error('Ошибка загрузки животных:', error);
            alert('Ошибка загрузки списка животных');
            setAnimals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const showToastMessage = (message: string, duration = TOAST_DURATION) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), duration);
    };

    // Сохраняем лайкнутое животное в localStorage
    const saveLikeToStorage = (animal: Animal) => {
        const stored = localStorage.getItem('likedAnimals');
        const likes: Animal[] = stored ? JSON.parse(stored) : [];
        const alreadyLiked = likes.some(a => a.id === animal.id);
        if (alreadyLiked) return;

        likes.push({ ...animal, likedAt: new Date().toISOString() } as any);
        localStorage.setItem('likedAnimals', JSON.stringify(likes));
    };

    const handleSwipe = async (direction: 'left' | 'right') => {
        const currentAnimal = animals[currentIndex];
        if (!currentAnimal || isProcessing) return;

        setIsProcessing(true);
        setSwipeClass(direction);
        if (showHint) setShowHint(false);

        try {
            if (direction === 'right') {
                await sendLike(currentAnimal.id);
                saveLikeToStorage(currentAnimal);
                showToastMessage(`🐾 Вам понравился ${currentAnimal.name}!`);
            } else {
                await sendDislike(currentAnimal.id);
                showToastMessage(`👎 Вы пропустили ${currentAnimal.name}`, 1500);
            }

            // Ждём анимацию свайпа, потом переходим к следующей карточке
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setSwipeClass('');
                setIsProcessing(false);
            }, SWIPE_ANIMATION);

        } catch (error: any) {
            console.error('Ошибка при отправке реакции:', error);
            showToastMessage(`❌ ${error.response?.data?.message || 'Ошибка при отправке'}`);
            setSwipeClass('');
            setIsProcessing(false);
        }
    };

    const handleReload = () => {
        loadAnimals();
        setCurrentIndex(0);
    };

    // Форматирование возраста с правильным склонением
    const getAgeText = (age: number): string => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const getGenderIcon = (gender: string): string =>
        gender === 'MAN' ? '♂️' : '♀️';

    const truncateText = (text: string, maxLength = 120): string => {
        if (!text) return 'Нет описания';
        return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
    };

    // Ключ картинки совпадает с тем что используется при сохранении
    const getAnimalImage = (animal: Animal): string | null => {
        const key = `${animal.name}_${animal.breed}_${animal.age}`;
        return animalImages[key] || null;
    };

    const getStatusLabel = (status: string): string => {
        const map: Record<string, string> = {
            AVAILABLE: 'Доступен',
            TAKEN: 'Забран',
            VERIFICATION: 'На проверке',
        };
        return map[status] ?? 'Доступен';
    };

    return {
        animals,
        isLoading,
        currentIndex,
        swipeClass,
        toastMessage,
        showToast,
        showHint,
        isProcessing,
        currentAnimal: animals[currentIndex] ?? null,
        nextAnimal: animals[currentIndex + 1] ?? null,
        navigate,
        handleSwipe,
        handleReload,
        getAgeText,
        getGenderIcon,
        truncateText,
        getAnimalImage,
        getStatusLabel,
    };
}
