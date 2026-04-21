
import { useMain } from './useMain';
import '../../style/MainPage.scss';

export default function MainPage() {
    const {
        isLoading,
        swipeClass,
        toastMessage,
        showToast,
        isProcessing,
        currentAnimal,
        nextAnimal,
        navigate,
        handleSwipe,
        handleReload,
        getAgeText,
        getGenderIcon,
        truncateText,
        getAnimalImage,
        getStatusLabel,
    } = useMain();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
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
                    <button onClick={handleReload} className="reload-btn">
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
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={`floating-shape shape-${i + 1}`} />
                ))}
                {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="heart">❤️</div>
                ))}
                {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="paw">🐾</div>
                ))}
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

                        {/* Следующая карточка (под текущей) */}
                        {nextAnimal && (
                            <div className="card next">
                                <div className="card-image">
                                    {getAnimalImage(nextAnimal) ? (
                                        <img src={getAnimalImage(nextAnimal)!} alt={nextAnimal.name} />
                                    ) : (
                                        <div className="image-placeholder">
                                            <span className="animal-emoji">
                                                {nextAnimal.animalType === 'DOG' ? '🐕' : '🐈'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <h2>{nextAnimal.name}</h2>
                                    <span>{nextAnimal.breed} • {getAgeText(nextAnimal.age)}</span>
                                    <p>{truncateText(nextAnimal.description)}</p>
                                </div>
                            </div>
                        )}

                        {/* Текущая карточка */}
                        <div className={`card current ${swipeClass}`}>
                            <div className="card-image">
                                {getAnimalImage(currentAnimal) ? (
                                    <img src={getAnimalImage(currentAnimal)!} alt={currentAnimal.name} />
                                ) : (
                                    <div className="image-placeholder">
                                        <span className="animal-emoji large">
                                            {currentAnimal.animalType === 'DOG' ? '🐕' : '🐈'}
                                        </span>
                                    </div>
                                )}
                                <span className={`status-badge ${currentAnimal.status?.toLowerCase() || 'available'}`}>
                                    {getStatusLabel(currentAnimal.status)}
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

                    {/* Кнопки свайпа */}
                    <div className="buttons">
                        <button
                            onClick={() => handleSwipe('left')}
                            className="btn-dislike"
                            disabled={isProcessing}
                        >
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M18 6L6 18M6 6l12 12"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </button>

                        <button
                            onClick={() => handleSwipe('right')}
                            className="btn-like"
                            disabled={isProcessing}
                        >
                            <svg viewBox="0 0 24 24" className="icon">
                                <path d="M12 21s-7-4.6-9.5-9C.5 8.2 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C20 5 22.5 8.2 21.5 12 19 16.4 12 21 12 21z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
