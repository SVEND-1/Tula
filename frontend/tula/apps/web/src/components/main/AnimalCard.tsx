import React from 'react';
import type { Animal } from '../../types/animal/animal.types';

interface Props {
    animal: Animal;
    variant: 'current' | 'next';
    swipeClass?: string;
    getAnimalImage: (animal: Animal) => string | null;
    getAgeText: (age: number) => string;
    getGenderIcon: (gender: string) => string;
    getStatusLabel: (status: string) => string;
    truncateText: (text: string) => string;
    onOpenModal?: () => void; // только для current
}

const AnimalCard: React.FC<Props> = ({
    animal,
    variant,
    swipeClass = '',
    getAnimalImage,
    getAgeText,
    getGenderIcon,
    getStatusLabel,
    truncateText,
    onOpenModal,
}) => {
    const image = getAnimalImage(animal);
    const isCurrent = variant === 'current';

    return (
        <div className={`card ${variant} ${swipeClass}`}>
            <div className="card-image">
                {image ? (
                    <img src={image} alt={animal.name} />
                ) : (
                    <div className="image-placeholder">
                        <span className={`animal-emoji ${isCurrent ? 'large' : ''}`}>
                            {animal.animalType === 'DOG' ? '🐕' : '🐈'}
                        </span>
                    </div>
                )}
                {isCurrent && (
                    <span className={`status-badge ${animal.status?.toLowerCase() || 'available'}`}>
                        {getStatusLabel(animal.status)}
                    </span>
                )}
            </div>

            <div className="card-info">
                <h2>
                    {animal.name}
                    {isCurrent && (
                        <span className="gender-icon">{getGenderIcon(animal.gender)}</span>
                    )}
                </h2>
                <span>{animal.breed} • {getAgeText(animal.age)}</span>
                <p className={isCurrent ? 'description' : ''}>{truncateText(animal.description)}</p>
                {isCurrent && onOpenModal && (
                    <button onClick={onOpenModal} className="details-btn">
                        Подробнее
                    </button>
                )}
            </div>
        </div>
    );
};

export default AnimalCard;
