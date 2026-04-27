import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOwnerProfile } from '../../api/ownerApi';
import { getReviewsByOwnerId, addReview } from '../../api/reviewApi';
import { getAnimalImageUrl } from '../../api/animalApi';
import { createFollow, getFollowersCount, deleteFollow, getUserFollows } from '../../api/followApi';
import type { OwnerProfileResponse, Animal } from '../../api/ownerApi';
import type { Review } from '../../api/reviewApi';
import '../../style/OwnerProfile.scss';
import QrCode from '../../components/qr/QrCode';

export default function OwnerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<OwnerProfileResponse | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [animalImages, setAnimalImages] = useState<Record<number, string>>({});
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [currentFollowId, setCurrentFollowId] = useState<number | null>(null);

    useEffect(() => {
        loadAllData();
    }, [id]);

    const loadAllData = async () => {
        setIsLoading(true);
        try {
            await loadProfile();
            await loadReviews();
            await loadFollowersCount();
            await checkFollowStatus();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadProfile = async () => {
        try {
            if (id) {
                const response = await getOwnerProfile(Number(id));
                setProfile(response.data);
                console.log('Профиль приюта:', response.data);

                if (response.data.animals) {
                    for (const animal of response.data.animals) {
                        const imageUrl = await getAnimalImageUrl(animal.id);
                        if (imageUrl) {
                            setAnimalImages(prev => ({ ...prev, [animal.id]: imageUrl }));
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки профиля приюта:', error);
        }
    };

    const loadReviews = async () => {
        try {
            if (id) {
                const response = await getReviewsByOwnerId(Number(id));
                setReviews(response.data);
                console.log('Отзывы:', response.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки отзывов:', error);
            setReviews([]);
        }
    };

    const loadFollowersCount = async () => {
        try {
            if (id) {
                const response = await getFollowersCount(Number(id));
                setFollowersCount(response.data);
                console.log('Количество подписчиков:', response.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки количества подписчиков:', error);
            setFollowersCount(0);
        }
    };

    const checkFollowStatus = async () => {
        try {
            if (!id) return;

            console.log('Проверяем подписку на приют:', id);

            const response = await getUserFollows();
            const follows = response.data;
            console.log('Все подписки пользователя:', follows);

            if (!follows || follows.length === 0) {
                console.log('Нет подписок');
                setIsFollowing(false);
                setCurrentFollowId(null);
                return;
            }
            const currentOwnerName = profile?.name;
            const foundFollow = follows.find((follow: any) => follow.ownerName === currentOwnerName);

            if (foundFollow) {
                setIsFollowing(true);
                setCurrentFollowId(Number(id));
                console.log('Пользователь подписан');
            } else {
                setIsFollowing(false);
                setCurrentFollowId(null);
                console.log('Пользователь не подписан');
            }

        } catch (error) {
            console.error('Ошибка проверки подписки:', error);
            setIsFollowing(false);
            setCurrentFollowId(null);
        }
    };

    const handleFollow = async () => {
        if (!id) return;
        setIsFollowLoading(true);
        try {
            console.log('Подписываемся на приют:', id);
            await createFollow(Number(id));
            alert('✅ Вы подписались на приют!');

            await loadFollowersCount();
            setIsFollowing(true);
            setCurrentFollowId(Number(id));
        } catch (error: any) {
            console.error('Ошибка подписки:', error);
            const errorMessage = error.response?.data?.message || 'Ошибка при подписке';
            alert(`❌ ${errorMessage}`);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (!currentFollowId) {
            console.error('Не найден ID подписки');
            alert('❌ Не удалось определить подписку');
            return;
        }

        setIsFollowLoading(true);
        try {
            console.log('Отписываемся от приюта с ID:', currentFollowId);

            await deleteFollow(currentFollowId);
            alert('✅ Вы отписались от приюта');

            await loadFollowersCount();
            setIsFollowing(false);
            setCurrentFollowId(null);

        } catch (error: any) {
            console.error('Ошибка отписки:', error);
            alert(`❌ Ошибка при отписке: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsFollowLoading(false);
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
            await addReview({
                content: reviewText,
                ownerId: Number(id)
            });
            alert('✅ Отзыв успешно добавлен!');
            setReviewText('');
            await loadReviews();
        } catch (error: any) {
            console.error('Ошибка добавления отзыва:', error);
            alert('❌ Ошибка при добавлении отзыва');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAnimalImage = (animal: Animal) => {
        return animalImages[animal.id] || null;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
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
        const track = document.getElementById('animals-track');
        if (track) {
            track.scrollBy({ left: -220, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        const track = document.getElementById('animals-track');
        if (track) {
            track.scrollBy({ left: 220, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setTimeout(checkScrollButtons, 100);
        window.addEventListener('resize', checkScrollButtons);
        return () => window.removeEventListener('resize', checkScrollButtons);
    }, [profile]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="error-container">
                <h2>Приют не найден</h2>
                <button onClick={() => navigate('/main')} className="back-btn">
                    ← Вернуться
                </button>
            </div>
        );
    }

    return (
        <>
            <header className="owner-header">
                <button onClick={() => navigate('/main')} className="back-btn">
                    ← Назад
                </button>
                <div className="logo">Adoptly</div>
                <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
            </header>

            <main className="owner-container">
                <div className="owner-card">
                    <div className="owner-header-info">
                        <h1 className="owner-title">{profile.name}</h1>

                        <div className="follow-section">
                            <div className="followers-count">
                                <span className="followers-icon">👥</span>
                                <span className="followers-number">{followersCount}</span>
                                <span className="followers-label">
                                    {followersCount === 1 ? 'подписчик' :
                                        followersCount >= 2 && followersCount <= 4 ? 'подписчика' : 'подписчиков'}
                                </span>
                            </div>
                            <button
                                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                onClick={isFollowing ? handleUnfollow : handleFollow}
                                disabled={isFollowLoading}
                            >
                                {isFollowLoading ? (
                                    <span className="loading-spinner-small"></span>
                                ) : isFollowing ? (
                                    '✓ Отписаться'
                                ) : (
                                    '+ Подписаться'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="owner-section">
                        <h2 className="section-title">Животные</h2>
                        <div className="animals-slider">
                            <button className={`slider-arrow left ${showLeftArrow ? 'visible' : ''}`} onClick={scrollLeft}>
                                ‹
                            </button>
                            <div className="animals-track" id="animals-track">
                                {profile.animals && profile.animals.map((animal) => (
                                    <div key={animal.id} className="animal-item" onClick={() => navigate(`/animal/${animal.id}`)}>
                                        <div className="animal-image">
                                            {getAnimalImage(animal) ? (
                                                <img src={getAnimalImage(animal)!} alt={animal.name} />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <span className="animal-emoji">
                                                        {animal.animalType === 'DOG' ? '🐕' : '🐈'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="animal-name">{animal.name}</div>
                                        <div className="animal-breed">{animal.breed}</div>
                                    </div>
                                ))}
                            </div>
                            <button className={`slider-arrow right ${showRightArrow ? 'visible' : ''}`} onClick={scrollRight}>
                                ›
                            </button>
                        </div>
                    </div>

                    <div className="owner-section">
                        <h2 className="section-title">Отзывы</h2>

                        <div className="add-review-form">
                            <h3>Оставить отзыв</h3>
                            <form onSubmit={handleAddReview}>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Поделитесь своим опытом общения с приютом..."
                                    rows={4}
                                    disabled={isSubmitting}
                                />
                                <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Отправка...' : '✍️ Оставить отзыв'}
                                </button>
                            </form>
                        </div>

                        <div className="reviews-list">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-content">{review.content}</div>
                                        <div className="review-date">{formatDate(review.createdAt)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-reviews">
                                    <p>Нет отзывов</p>
                                    <span>Будьте первым, кто оставит отзыв!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="owner-section">
                        <h2 className="section-title">Поделиться</h2>
                        <QrCode ownerId={Number(id)} ownerName={profile.name} />
                    </div>
                </div>
            </main>
        </>
    );
}