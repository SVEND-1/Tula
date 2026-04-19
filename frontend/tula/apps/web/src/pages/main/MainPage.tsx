import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAnimals } from '../../api/animalApi';
import { sendLike, sendDislike } from '../../api/likeApi';
import type { Animal } from '../../types/animal/animal.types.ts';
import '../../style/MainPage.scss';
import { useSound } from '../../hooks/useSound';

export default function MainPage() {
    const navigate = useNavigate();
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [swipeClass, setSwipeClass] = useState('');
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const { playLikeSound, playDislikeSound } = useSound();

    useEffect(() => {
        loadAnimals();
        loadImagesFromStorage();

        const timer = setTimeout(() => {
            setShowHint(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const loadImagesFromStorage = () => {
        const storedImages = localStorage.getItem('animalImages');
        if (storedImages) {
            const parsed = JSON.parse(storedImages);
            setAnimalImages(parsed);
        }
    };

    const loadAnimals = async () => {
        setIsLoading(true);
        try {
            const response = await getAllAnimals();

            if (response.data && response.data.length > 0) {
                setAnimals(response.data);
            } else {
                setAnimals([]);
            }
        } catch (error: any) {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка загрузки списка животных');
            setAnimals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getGenderIcon = (gender: string) => gender === 'MAN' ? '♂️' : '♀️';

    const currentAnimal = animals[currentIndex];
    const nextAnimal = animals[currentIndex + 1];

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (!currentAnimal || isProcessing) return;

        setIsProcessing(true);
        setSwipeClass(direction);

        if (showHint) {
            setShowHint(false);
        }

        try {
            if (direction === 'right') {
                playLikeSound();
                const response = await sendLike(currentAnimal.id);
                console.log('Ответ сервера:', response.data);

                const storedLikes = localStorage.getItem('likedAnimals');
                const likes = storedLikes ? JSON.parse(storedLikes) : [];
                const alreadyLiked = likes.some((a: any) => a.id === currentAnimal.id);

                if (!alreadyLiked) {
                    likes.push({
                        id: currentAnimal.id,
                        name: currentAnimal.name,
                        breed: currentAnimal.breed,
                        age: currentAnimal.age,
                        description: currentAnimal.description,
                        gender: currentAnimal.gender,
                        animalType: currentAnimal.animalType,
                        status: currentAnimal.status,
                        likedAt: new Date().toISOString()
                    });
                    localStorage.setItem('likedAnimals', JSON.stringify(likes));
                    console.log('✅ Лайк сохранён в localStorage');
                }

                setToastMessage(`🐾 Вам понравился ${currentAnimal.name}!`);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } else {
                playDislikeSound();
                await sendDislike(currentAnimal.id);
                setToastMessage(`👎 Вы пропустили ${currentAnimal.name}`);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 1500);
            }

            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setSwipeClass('');
                setIsProcessing(false);
            }, 900);
        } catch (error: any) {
            console.error('Ошибка при отправке реакции:', error);
            const errorMessage = error.response?.data?.message || 'Ошибка при отправке';
            setToastMessage(`❌ ${errorMessage}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            setSwipeClass('');
            setIsProcessing(false);
        }
    };

    const getAgeText = (age: number) => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const truncateText = (text: string, maxLength: number = 120) => {
        if (!text) return 'Нет описания';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const getAnimalImage = (animal: Animal) => {
        const uniqueKey = `${animal.name}_${animal.breed}_${animal.age}`;
        const image = animalImages[uniqueKey];
        return image || null;
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Загрузка животных...</p>
            </div>
        );
    }

    if (!currentAnimal) {
        return (
            <div className="empty-container">
                <div className="empty-card">
                    <span className="empty-emoji">🐾</span>
                    <h2>Животные закончились</h2>
                    <p>Всего животных в базе: {animals.length}</p>
                    <button onClick={() => {
                        loadAnimals();
                        setCurrentIndex(0);
                    }} className="reload-btn">
                        Обновить список
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Фоновые анимации */}
            <div className="bg-animation">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
                <div className="floating-shape shape-5"></div>
                <div className="floating-shape shape-6"></div>
                <div className="floating-shape shape-7"></div>
                <div className="floating-shape shape-8"></div>
                <div className="floating-shape shape-9"></div>
                <div className="floating-shape shape-10"></div>

                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>
                <div className="heart">❤️</div>

                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
                <div className="paw">🐾</div>
            </div>

            <header className="adopt-header">
                <div className="logo">Adoptly</div>
                <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
            </header>

            <div className={`toast ${showToast ? 'show' : ''}`}>
                {toastMessage}
            </div>

            <main className="home">
                <div className="card-wrapper">
                    <div className="card-stack">
                        {nextAnimal && (
                            <div className="card next">
                                <div className="card-image">
                                    {(() => {
                                        const nextImage = getAnimalImage(nextAnimal);
                                        return nextImage ? (
                                            <img src={nextImage} alt={nextAnimal.name} />
                                        ) : (
                                            <div className="image-placeholder">
                                            <span className="animal-emoji">
                                                {nextAnimal.animalType === 'DOG' ? '🐕' : '🐈'}
                                            </span>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="card-info">
                                    <h2>{nextAnimal.name}</h2>
                                    <span>{nextAnimal.breed} • {getAgeText(nextAnimal.age)}</span>
                                    <p>{truncateText(nextAnimal.description)}</p>
                                </div>
                            </div>
                        )}

                        <div className={`card current ${swipeClass}`}>
                            <div className="card-image">
                                {(() => {
                                    const currentImage = getAnimalImage(currentAnimal);
                                    return currentImage ? (
                                        <img src={currentImage} alt={currentAnimal.name} />
                                    ) : (
                                        <div className="image-placeholder">
                                        <span className="animal-emoji large">
                                            {currentAnimal.animalType === 'DOG' ? '🐕' : '🐈'}
                                        </span>
                                        </div>
                                    );
                                })()}
                                <span className={`status-badge ${currentAnimal.status?.toLowerCase() || 'available'}`}>
                                {currentAnimal.status === 'AVAILABLE' ? 'Доступен' :
                                    currentAnimal.status === 'TAKEN' ? 'Забран' :
                                        currentAnimal.status === 'VERIFICATION' ? 'На проверке' : 'Доступен'}
                            </span>
                            </div>
                            <div className="card-info">
                                <h2>
                                    {currentAnimal.name}
                                    <span className="gender-icon">{getGenderIcon(currentAnimal.gender)}</span>
                                </h2>
                                <span>{currentAnimal.breed} • {getAgeText(currentAnimal.age)}</span>
                                <p className="description">{truncateText(currentAnimal.description)}</p>
                                <button
                                    onClick={() => navigate(`/animal/${currentAnimal.id}`)}
                                    className="details-btn"
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="buttons">
                        <button
                            onClick={() => handleSwipe('left')}
                            className="btn-dislike"
                            disabled={isProcessing}
                        >
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M18 6L6 18M6 6l12 12"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"/>
                            </svg>
                        </button>

                        <button
                            onClick={() => handleSwipe('right')}
                            className="btn-like"
                            disabled={isProcessing}
                        >
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M12 21s-7-4.6-9.5-9C.5 8.2 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C20 5 22.5 8.2 21.5 12 19 16.4 12 21 12 21z"
                                      fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}