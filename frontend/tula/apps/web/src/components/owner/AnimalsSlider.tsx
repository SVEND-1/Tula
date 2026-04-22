import React from 'react';
import type { Animal } from '../../api/ownerApi';

interface Props {
    animals: Animal[];
    showLeftArrow: boolean;
    showRightArrow: boolean;
    getAnimalImage: (animal: Animal) => string | null;
    onAnimalClick: (id: number) => void;
    onScrollLeft: () => void;
    onScrollRight: () => void;
}

// Горизонтальный слайдер с карточками животных приюта
const AnimalsSlider: React.FC<Props> = ({
    animals,
    showLeftArrow,
    showRightArrow,
    getAnimalImage,
    onAnimalClick,
    onScrollLeft,
    onScrollRight,
}) => (
    <div className="owner-section">
        <h2 className="section-title">Животные</h2>

        <div className="animals-slider">
            <button
                className={`slider-arrow left ${showLeftArrow ? 'visible' : ''}`}
                onClick={onScrollLeft}
            >‹</button>

            <div className="animals-track" id="animals-track">
                {animals?.map((animal) => (
                    <div
                        key={animal.id}
                        className="animal-item"
                        onClick={() => onAnimalClick(animal.id)}
                    >
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

            <button
                className={`slider-arrow right ${showRightArrow ? 'visible' : ''}`}
                onClick={onScrollRight}
            >›</button>
        </div>
    </div>
);

export default AnimalsSlider;
