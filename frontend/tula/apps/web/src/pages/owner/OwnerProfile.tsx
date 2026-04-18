import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOwnerProfile } from '../../api/ownerApi';
import type { OwnerProfileResponse, Animal } from '../../api/ownerApi';
import '../../style/OwnerProfile.scss';

export default function OwnerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<OwnerProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    useEffect(() => {
        loadProfile();
        loadImagesFromStorage();
    }, [id]);

    const loadImagesFromStorage = () => {
        const storedImages = localStorage.getItem('animalImages');
        if (storedImages) {
            const parsed = JSON.parse(storedImages);
            setAnimalImages(parsed);
        }
    };

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            if (id) {
                const response = await getOwnerProfile(Number(id));
                setProfile(response.data);
                console.log('Профиль приюта:', response.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки профиля приюта:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAnimalImage = (animal: Animal) => {
        const uniqueKey = `${animal.name}_${animal.breed}_${animal.age}`;
        return animalImages[uniqueKey] || null;
    };

    const getAgeText = (age: number) => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
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
                <div className="logo">Adoptly</div>
            </header>

            <button className="global-close" onClick={() => navigate('/main')}>×</button>

            <main className="page">
                <div className="container">
                    <section className="block">
                        <h1 id="shelter-name">{profile.name}</h1>
                    </section>

                    <div className="divider"></div>

                    <section className="block">
                        <h2>Животные</h2>

                        <div className="slider-wrapper">
                            {showLeftArrow && (
                                <button className="arrow left" onClick={scrollLeft}>‹</button>
                            )}

                            <div id="animals-track" className="animals-track">
                                {profile.animals && profile.animals.map((animal) => (
                                    <div
                                        key={animal.id}
                                        className="animal-card"
                                        onClick={() => navigate(`/animal/${animal.id}`)}
                                    >
                                        {getAnimalImage(animal) ? (
                                            <img src={getAnimalImage(animal)!} alt={animal.name} />
                                        ) : (
                                            <div className="animal-image-placeholder">
                                                <span className="animal-emoji">
                                                    {animal.animalType === 'DOG' ? '🐕' : '🐈'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="animal-info">
                                            <div className="animal-name">{animal.name}</div>
                                            <div className="animal-breed">{animal.breed}</div>
                                            <div className="animal-age">{getAgeText(animal.age)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {showRightArrow && (
                                <button className="arrow right" onClick={scrollRight}>›</button>
                            )}
                        </div>
                    </section>

                    <div className="divider"></div>

                    <section className="block">
                        <h2>Отзывы</h2>
                        <div id="reviews-list" className="reviews-list">
                            {profile.reviews && profile.reviews.length > 0 ? (
                                profile.reviews.map((review) => (
                                    <div key={review.id} className="review">
                                        <div className="review-name">{review.authorName || 'Аноним'}</div>
                                        <div className="review-text">{review.content}</div>
                                        <div className="review-date">{review.createdAt ? new Date(review.createdAt).toLocaleDateString('ru-RU') : ''}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-reviews">
                                    <span>📝</span>
                                    <p>Нет отзывов</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}