import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOwnerProfile } from '../../api/ownerApi';
import { getReviewsByOwnerId, addReview } from '../../api/reviewApi';
import type { OwnerProfileResponse, Animal } from '../../api/ownerApi';
import type { Review } from '../../api/reviewApi';

export function useOwner() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<OwnerProfileResponse | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadProfile();
        loadReviews();
        loadImagesFromStorage();
    }, [id]);

    // Слушаем ресайз для кнопок слайдера
    useEffect(() => {
        setTimeout(checkScrollButtons, 100);
        window.addEventListener('resize', checkScrollButtons);
        return () => window.removeEventListener('resize', checkScrollButtons);
    }, [profile]);

    // Берём картинки животных из localStorage (временное решение)
    const loadImagesFromStorage = () => {
        const stored = localStorage.getItem('animalImages');
        if (stored) setAnimalImages(JSON.parse(stored));
    };

    const loadProfile = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await getOwnerProfile(Number(id));
            setProfile(res.data);
        } catch (error) {
            console.error('Ошибка загрузки профиля приюта:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadReviews = async () => {
        if (!id) return;
        try {
            const res = await getReviewsByOwnerId(Number(id));
            setReviews(res.data);
        } catch (error) {
            console.error('Ошибка загрузки отзывов:', error);
            setReviews([]);
        }
    };

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim()) {
            alert('Введите текст отзыва');
            return;
        }
        setIsSubmitting(true);
        try {
            await addReview({ content: reviewText, ownerId: Number(id) });
            alert('Отзыв успешно добавлен!');
            setReviewText('');
            await loadReviews();
        } catch (error) {
            console.error('Ошибка добавления отзыва:', error);
            alert('Ошибка при добавлении отзыва');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Ключ картинки совпадает с тем что используется при сохранении
    const getAnimalImage = (animal: Animal): string | null => {
        const key = `${animal.name}_${animal.breed}_${animal.age}`;
        return animalImages[key] || null;
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    const checkScrollButtons = () => {
        const track = document.getElementById('animals-track');
        if (track) {
            const needScroll = track.scrollWidth > track.clientWidth + 5;
            setShowLeftArrow(needScroll);
            setShowRightArrow(needScroll);
        }
    };

    const scrollLeft = () => {
        document.getElementById('animals-track')?.scrollBy({ left: -220, behavior: 'smooth' });
    };

    const scrollRight = () => {
        document.getElementById('animals-track')?.scrollBy({ left: 220, behavior: 'smooth' });
    };

    return {
        id,
        profile,
        reviews,
        isLoading,
        showLeftArrow,
        showRightArrow,
        reviewText,
        isSubmitting,
        navigate,
        setReviewText,
        handleAddReview,
        getAnimalImage,
        formatDate,
        scrollLeft,
        scrollRight,
    };
}
