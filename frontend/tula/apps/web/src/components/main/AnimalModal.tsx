import React from 'react';
import type { Animal } from '../../types/animal/animal.types';

interface Props {
    animal: Animal;
    images: string[];
    currentImageIndex: number;
    isLoadingOwner: boolean;
    getAgeText: (age: number) => string;
    getGenderIcon: (gender: string) => string;
    getAnimalTypeText: (type: string) => string;
    onClose: () => void;
    onNextImage: () => void;
    onPrevImage: () => void;
    onGoToOwner: (animal: Animal) => void;
}

// Модалка с подробной информацией о животном
const AnimalModal: React.FC<Props> = ({
    animal,
    images,
    currentImageIndex,
    isLoadingOwner,
    getAgeText,
    getGenderIcon,
    getAnimalTypeText,
    onClose,
    onNextImage,
    onPrevImage,
    onGoToOwner,
}) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>✕</button>

            <div className="modal-body">
                {/* Фото */}
                <div className="modal-image-section">
                    <div className="modal-image-container">
                        {images.length > 0 ? (
                            <>
                                <img src={images[currentImageIndex]} alt={animal.name} />
                                {images.length > 1 && (
                                    <>
                                        <button className="modal-image-nav prev" onClick={onPrevImage}>‹</button>
                                        <button className="modal-image-nav next" onClick={onNextImage}>›</button>
                                        <div className="modal-image-counter">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="image-placeholder">
                                <span className="animal-emoji">
                                    {animal.animalType === 'DOG' ? '🐕' : '🐈'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Информация */}
                <div className="modal-info-section">
                    <h2>
                        {animal.name}
                        <span className="gender-icon">{getGenderIcon(animal.gender)}</span>
                    </h2>

                    <div className="modal-details">
                        <div className="modal-detail-row">
                            <span className="detail-label">Тип:</span>
                            <span className="detail-value">{getAnimalTypeText(animal.animalType)}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="detail-label">Порода:</span>
                            <span className="detail-value">{animal.breed}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="detail-label">Пол:</span>
                            <span className="detail-value">
                                {animal.gender === 'MAN' ? 'Мальчик' : 'Девочка'}
                            </span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="detail-label">Возраст:</span>
                            <span className="detail-value">{getAgeText(animal.age)}</span>
                        </div>
                    </div>

                    <div className="modal-description">
                        <h3>Описание</h3>
                        <p>{animal.description || 'Нет описания'}</p>
                    </div>

                    <button
                        className="owner-btn"
                        onClick={() => onGoToOwner(animal)}
                        disabled={isLoadingOwner}
                    >
                        {isLoadingOwner ? 'Загрузка...' : 'Перейти к владельцу'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default AnimalModal;
