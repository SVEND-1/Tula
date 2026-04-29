import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAnimals, getAnimalImageUrl, getAnimalProfile } from '../../api/animalApi';
import { sendLike, sendDislike } from '../../api/likeApi';
import type { Animal } from '../../types/animal/animal.types.ts';
import '../../style/MainPage.scss';
import { useSound } from '../../hooks/useSound';

export default function MainPage() {
    const navigate = useNavigate();
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
    const [showModal, setShowModal] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [modalImages, setModalImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoadingOwner, setIsLoadingOwner] = useState(false);
    const { playLikeSound, playDislikeSound } = useSound();

    useEffect(() => {
        loadAnimals();

        const timer = setTimeout(() => {
            setShowHint(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const loadAnimals = async () => {
        setIsLoading(true);
        try {
            const response = await getAllAnimals();
            console.log('Ответ от сервера:', response.data);

            if (response.data && response.data.content && response.data.content.length > 0) {
                const animalsList = response.data.content;
                setAnimals(animalsList);
                await loadAnimalImages(animalsList);
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

    const loadAnimalImages = async (animalsList: Animal[]) => {
        const imagesMap: Record<number, string> = {};

        for (const animal of animalsList) {
            const imageUrl = await getAnimalImageUrl(animal.id);
            if (imageUrl) {
                imagesMap[animal.id] = imageUrl;
            }
        }

        setAnimalImages(imagesMap);
    };

    const getGenderIcon = (gender: string) => gender === 'MAN' ? '♂️' : '♀️';
    const getAnimalTypeText = (type: string) => type === 'DOG' ? 'Собака' : 'Кот';

    const currentAnimal = animals[currentIndex];
    const nextAnimal = animals[currentIndex + 1];

    const handleOpenModal = async (animal: Animal) => {
        setSelectedAnimal(animal);
        setShowModal(true);
        setCurrentImageIndex(0);

        const imageUrl = await getAnimalImageUrl(animal.id);
        if (imageUrl) {
            setModalImages([imageUrl]);
        } else {
            setModalImages([]);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAnimal(null);
        setModalImages([]);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev < modalImages.length - 1 ? prev + 1 : 0
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : modalImages.length - 1
        );
    };

    const handleGoToOwner = async (animal: Animal) => {
        setIsLoadingOwner(true);
        try {
            const profileResponse = await getAnimalProfile(animal.id);
            const ownerId = profileResponse.data.ownerId;

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

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (!currentAnimal || isProcessing || isTransitioning) return;

        setIsProcessing(true);
        setIsTransitioning(true);
        setSwipeClass(direction);

        if (showHint) {
            setShowHint(false);
        }

        try {
            if (direction === 'right') {
                playLikeSound();
                await sendLike(currentAnimal.id);
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

            setOldAnimal(currentAnimal);

            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setSwipeClass('');
                setOldAnimal(null);
                setIsTransitioning(false);
                setIsProcessing(false);
            }, 500);
        } catch (error: any) {
            console.error('Ошибка при отправке реакции:', error);
            const errorMessage = error.response?.data?.message || 'Ошибка при отправке';
            setToastMessage(`❌ ${errorMessage}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            setSwipeClass('');
            setOldAnimal(null);
            setIsTransitioning(false);
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
        return animalImages[animal.id] || null;
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Загрузка животных...</p>
            </div>
        );
    }

    if (!currentAnimal && !oldAnimal) {
        return (
            <div className="empty-container">
                <div className="empty-card">
                    <span className="empty-emoji">🐾</span>
                    <h2>Животные закончились</h2>
                    <p>Всего животных в базе: {animals.length}</p>

                    <div className="empty-actions">
                        <button onClick={() => {
                            loadAnimals();
                            setCurrentIndex(0);
                        }} className="reload-btn">
                            🔄 Обновить список
                        </button>

                        <button onClick={() => navigate('/liked')} className="profile-btn">
                            👤 Перейти в профиль
                        </button>

                        <button onClick={() => navigate('/video')} className="video-btn">
                            🎬 Перейти к видео
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
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
                <div className="header-buttons">
                    <button onClick={() => navigate('/video')} className="video-header-btn" title="Видео лента">
                        🎬
                    </button>
                    <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
                </div>
            </header>

            <div className={`toast ${showToast ? 'show' : ''}`}>
                {toastMessage}
            </div>

            <main className="home">
                {showHint && (
                    <div className="hint">
                        <div className="hint-text">Выбери своего питомца</div>
                        <svg className="arrow" viewBox="0 0 300 200">
                            <defs>
                                <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill="#333"/>
                                </marker>
                            </defs>
                            <path className="arrow-path"
                                  d="M 20 120 C 60 20, 160 20, 160 90 C 160 160, 220 160, 260 110"
                                  marker-end="url(#arrowHead)"/>
                        </svg>
                    </div>
                )}

                <div className="card-wrapper">
                    <div className="card-stack">
                        {nextAnimal && !isTransitioning && (
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

                        {currentAnimal && (
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
                                        onClick={() => handleOpenModal(currentAnimal)}
                                        className="details-btn"
                                    >
                                        Подробнее
                                    </button>
                                </div>
                            </div>
                        )}
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

                    <div className="counter">
                        {currentIndex + 1} / {animals.length}
                    </div>
                </div>
            </main>

            {showModal && selectedAnimal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleCloseModal}>
                            ✕
                        </button>

                        <div className="modal-body">
                            <div className="modal-image-section">
                                <div className="modal-image-container">
                                    {modalImages.length > 0 ? (
                                        <>
                                            <img
                                                src={modalImages[currentImageIndex]}
                                                alt={selectedAnimal.name}
                                            />
                                            {modalImages.length > 1 && (
                                                <>
                                                    <button
                                                        className="modal-image-nav prev"
                                                        onClick={handlePrevImage}
                                                    >
                                                        ‹
                                                    </button>
                                                    <button
                                                        className="modal-image-nav next"
                                                        onClick={handleNextImage}
                                                    >
                                                        ›
                                                    </button>
                                                    <div className="modal-image-counter">
                                                        {currentImageIndex + 1} / {modalImages.length}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="image-placeholder">
                                            <span className="animal-emoji">
                                                {selectedAnimal.animalType === 'DOG' ? '🐕' : '🐈'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-info-section">
                                <h2>
                                    {selectedAnimal.name}
                                    <span className="gender-icon">
                                        {getGenderIcon(selectedAnimal.gender)}
                                    </span>
                                </h2>

                                <div className="modal-details">
                                    <div className="modal-detail-row">
                                        <span className="detail-label">Тип:</span>
                                        <span className="detail-value">
                                            {getAnimalTypeText(selectedAnimal.animalType)}
                                        </span>
                                    </div>

                                    <div className="modal-detail-row">
                                        <span className="detail-label">Порода:</span>
                                        <span className="detail-value">
                                            {selectedAnimal.breed}
                                        </span>
                                    </div>

                                    <div className="modal-detail-row">
                                        <span className="detail-label">Пол:</span>
                                        <span className="detail-value">
                                            {selectedAnimal.gender === 'MAN' ? 'Мальчик' : 'Девочка'}
                                        </span>
                                    </div>

                                    <div className="modal-detail-row">
                                        <span className="detail-label">Возраст:</span>
                                        <span className="detail-value">
                                            {getAgeText(selectedAnimal.age)}
                                        </span>
                                    </div>
                                </div>

                                <div className="modal-description">
                                    <h3>Описание</h3>
                                    <p>{selectedAnimal.description || 'Нет описания'}</p>
                                </div>

                                <button
                                    className="owner-btn"
                                    onClick={() => handleGoToOwner(selectedAnimal)}
                                    disabled={isLoadingOwner}
                                >
                                    {isLoadingOwner ? 'Загрузка...' : 'Перейти к владельцу'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}