import AnimalOwner from './AnimalOwner';

interface Props {
    animal: any; // можешь потом типизировать нормально
    getAgeText: (age: number) => string;
    getGenderIcon: (gender: string) => string;
    getGenderText: (gender: string) => string;
    getTypeText: (type: string) => string;
    formatDate: (date: string) => string;
    navigate: (path: string) => void;
}

const AnimalInfo: React.FC<Props> = ({
                                         animal,
                                         getAgeText,
                                         getGenderIcon,
                                         getGenderText,
                                         getTypeText,
                                         formatDate,
                                         navigate
                                     }) => (
    <div className="animal-info-section">
        <h1>
            {animal.name}
            <span className="gender-icon">
                {getGenderIcon(animal.gender)}
            </span>
        </h1>

        <div className="info-row">
            <span className="info-tag">{animal.breed}</span>
            <span className="info-tag">{getAgeText(animal.age)}</span>
            <span className="info-tag">{getGenderText(animal.gender)}</span>
            <span className="info-tag">{getTypeText(animal.animalType)}</span>
        </div>

        <div className="description-section">
            <p>{animal.description || 'Нет описания'}</p>
        </div>

        <AnimalOwner
            ownerName={animal.ownerName}
            createdAt={animal.createAt}
            formatDate={formatDate}
        />

        <button
            onClick={() => animal.ownerId && navigate(`/owner/${animal.ownerId}`)}
            className="contact-btn"
        >
            Перейти к владельцу
        </button>
    </div>
);

export default AnimalInfo;