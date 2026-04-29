
import { useMain } from './useMain.ts';
import BackgroundAnimation from '../../components/main/BackgroundAnimation';
import Toast from '../../components/main/Toast';
import SwipeHint from '../../components/main/SwipeHint';
import AnimalCard from '../../components/main/AnimalCard';
import SwipeButtons from '../../components/main/SwipeButtons';
import AnimalModal from '../../components/main/AnimalModal';
import '../../style/MainPage.scss';

import paw from '../../assets/paw.svg';

export default function MainPage() {
    const {
        animals,
        isLoading,
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
        currentAnimal,
        nextAnimal,
        currentIndex,
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
    } = useMain();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Загрузка животных...</p>
            </div>
        );
    }

    if (!currentAnimal && !oldAnimal) {
        return (
            <>
                <header className="adopt-header">
                    <div className="logo">Adoptly</div>
                    <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
                </header>
                <div className="empty-container">
                    <div className="empty-card">
                        <img src={paw} alt="paw" className="empty-emoji" />
                        <h2>Животные закончились</h2>
                        <p>Всего животных в базе: {animals.length}</p>
                        <button onClick={handleReload} className="reload-btn">
                            Обновить список
                        </button>
                    </div>
                </div>
            </>
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
                {showHint && <SwipeHint />}

                <div className="card-wrapper">
                    <div className="card-stack">
                        {/* Следующая карточка */}
                        {nextAnimal && !isTransitioning && (
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

                        {/* Текущая карточка */}
                        {currentAnimal && (
                            <AnimalCard
                                animal={currentAnimal}
                                variant="current"
                                swipeClass={swipeClass}
                                getAnimalImage={getAnimalImage}
                                getAgeText={getAgeText}
                                getGenderIcon={getGenderIcon}
                                getStatusLabel={getStatusLabel}
                                truncateText={truncateText}
                                onOpenModal={() => handleOpenModal(currentAnimal)}
                            />
                        )}
                    </div>

                    <SwipeButtons
                        onLike={() => handleSwipe('right')}
                        onDislike={() => handleSwipe('left')}
                        disabled={isProcessing}
                    />

                    <div className="counter">
                        {currentIndex + 1} / {animals.length}
                    </div>
                </div>
            </main>

            {/* Модалка с деталями животного */}
            {showModal && selectedAnimal && (
                <AnimalModal
                    animal={selectedAnimal}
                    images={modalImages}
                    currentImageIndex={currentImageIndex}
                    isLoadingOwner={isLoadingOwner}
                    getAgeText={getAgeText}
                    getGenderIcon={getGenderIcon}
                    getAnimalTypeText={getAnimalTypeText}
                    onClose={handleCloseModal}
                    onNextImage={handleNextImage}
                    onPrevImage={handlePrevImage}
                    onGoToOwner={handleGoToOwner}
                />
            )}
        </>
    );
}
