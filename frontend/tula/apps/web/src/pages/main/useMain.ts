import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAnimals, getAnimalImageUrl, getAnimalProfile } from '../../api/animalApi';
import { sendLike, sendDislike } from '../../api/likeApi';
import type { Animal } from '../../types/animal/animal.types';
import { useSound } from '../../hooks/useSound';

const HINT_TIMEOUT = 8000;
const TOAST_DURATION_LIKE = 2000;
const TOAST_DURATION_DISLIKE = 1500;
const SWIPE_ANIMATION = 500;

export function useMain() {
    const navigate = useNavigate();
    const { playLikeSound, playDislikeSound } = useSound();

    const [animals, setAnimals] = useState<Animal[]>([]);
    const [animalImages, setAnimalImages] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [swipeClass, setSwipeClass] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [oldAnimal, setOldAnimal] = useState<Animal | null>(null);

    // Состояние модалки
    const [showModal, setShowModal] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [modalImages, setModalImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoadingOwner, setIsLoadingOwner] = useState(false);

    useEffect(() => {
        loadAnimals();
        const timer = setTimeout(() => setShowHint(false), HINT_TIMEOUT);
        return () => clearTimeout(timer);
    }, []);

    const loadAnimals = async () => {
        setIsLoading(true);
        try {
            const response = await getAllAnimals();
            const list = response.data?.content ?? [];
            setAnimals(list);
            if (list.length > 0) await loadAnimalImages(list);
        } catch (error: any) {
            console.error('Ошибка загрузки животных:', error);
            alert('Ошибка загрузки списка животных');
            setAnimals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadAnimalImages = async (list: Animal[]) => {
        const map: Record<number, string> = {};
        for (const animal of list) {
            const url = await getAnimalImageUrl(animal.id);
            if (url) map[animal.id] = url;
        }
        setAnimalImages(map);
    };

    const handleReload = () => {
        loadAnimals();
        setCurrentIndex(0);
    };

    const showToastMessage = (message: string, duration: number) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), duration);
    };

    const handleSwipe = async (direction: 'left' | 'right') => {
        const currentAnimal = animals[currentIndex];
        if (!currentAnimal || isProcessing || isTransitioning) return;

        setIsProcessing(true);
        setIsTransitioning(true);
        setSwipeClass(direction);
        if (showHint) setShowHint(false);

        try {
            if (direction === 'right') {
                playLikeSound();
                await sendLike(currentAnimal.id);
                showToastMessage(`🐾 Вам понравился ${currentAnimal.name}!`, TOAST_DURATION_LIKE);
            } else {
                playDislikeSound();
                await sendDislike(currentAnimal.id);
                showToastMessage(`👎 Вы пропустили ${currentAnimal.name}`, TOAST_DURATION_DISLIKE);
            }

            setOldAnimal(currentAnimal);

            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setSwipeClass('');
                setOldAnimal(null);
                setIsTransitioning(false);
                setIsProcessing(false);
            }, SWIPE_ANIMATION);

        } catch (error: any) {
            console.error('Ошибка при отправке реакции:', error);
            showToastMessage(`❌ ${error.response?.data?.message || 'Ошибка при отправке'}`, TOAST_DURATION_LIKE);
            setSwipeClass('');
            setOldAnimal(null);
            setIsTransitioning(false);
            setIsProcessing(false);
        }
    };

    // Модалка — открыть
    const handleOpenModal = async (animal: Animal) => {
        setSelectedAnimal(animal);
        setShowModal(true);
        setCurrentImageIndex(0);
        const url = await getAnimalImageUrl(animal.id);
        setModalImages(url ? [url] : []);
    };

    // Модалка — закрыть
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAnimal(null);
        setModalImages([]);
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev => prev < modalImages.length - 1 ? prev + 1 : 0);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => prev > 0 ? prev - 1 : modalImages.length - 1);
    };

    const handleGoToOwner = async (animal: Animal) => {
        setIsLoadingOwner(true);
        try {
            const res = await getAnimalProfile(animal.id);
            const ownerId = res.data.ownerId;
            if (ownerId) {
                handleCloseModal();
                navigate(`/owner/${ownerId}`);
            } else {
                alert('Не удалось определить владельца питомца');
            }
        } catch (error) {
            console.error('Ошибка получения профиля животного:', error);
            alert('Ошибка при получении информации о владельце');
        } finally {
            setIsLoadingOwner(false);
        }
    };

    // Хелперы форматирования
    const getAgeText = (age: number): string => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const truncateText = (text: string, maxLength = 120): string => {
        if (!text) return 'Нет описания';
        return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
    };

    const getGenderIcon = (gender: string): string => gender === 'MAN' ? '♂️' : '♀️';
    const getAnimalTypeText = (type: string): string => type === 'DOG' ? 'Собака' : 'Кот';
    const getAnimalImage = (animal: Animal): string | null => animalImages[animal.id] || null;

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
        isTransitioning,
        oldAnimal,
        showModal,
        selectedAnimal,
        modalImages,
        currentImageIndex,
        isLoadingOwner,
        currentAnimal: animals[currentIndex] ?? null,
        nextAnimal: animals[currentIndex + 1] ?? null,
        navigate,
        handleSwipe,
        handleReload,
        handleOpenModal,
        handleCloseModal,
        handleNextImage,
        handlePrevImage,
        handleGoToOwner,
        getAgeText,
        truncateText,
        getGenderIcon,
        getAnimalTypeText,
        getAnimalImage,
        getStatusLabel,
    };
}
