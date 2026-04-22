
import { useMain } from './useMain';
import BackgroundAnimation from '../../components/main/BackgroundAnimation';
import AnimalCard from '../../components/main/AnimalCard';
import SwipeButtons from '../../components/main/SwipeButtons';
import Toast from '../../components/main/Toast';
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
            <BackgroundAnimation />

            <header className="adopt-header">
                <div className="logo">Adoptly</div>
                <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
            </header>

            <Toast message={toastMessage} visible={showToast} />

            <main className="home">
                <div className="card-wrapper">
                    <div className="card-stack">
                        {nextAnimal && (
                            <AnimalCard
                                animal={nextAnimal}
                                variant="next"
                                getAnimalImage={getAnimalImage}
                                getAgeText={getAgeText}
                                getGenderIcon={getGenderIcon}
                                getStatusLabel={getStatusLabel}
                                truncateText={truncateText}
                            />
                        )}

                        <AnimalCard
                            animal={currentAnimal}
                            variant="current"
                            swipeClass={swipeClass}
                            getAnimalImage={getAnimalImage}
                            getAgeText={getAgeText}
                            getGenderIcon={getGenderIcon}
                            getStatusLabel={getStatusLabel}
                            truncateText={truncateText}
                            onNavigate={() => navigate(`/animal/${currentAnimal.id}`)}
                        />
                    </div>

                    <SwipeButtons
                        onLike={() => handleSwipe('right')}
                        onDislike={() => handleSwipe('left')}
                        disabled={isProcessing}
                    />
                </div>
            </main>
        </>
    );
}
