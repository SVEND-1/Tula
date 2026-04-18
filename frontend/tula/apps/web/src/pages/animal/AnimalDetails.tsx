import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnimalProfile } from '../../api/animalApi';
import type { AnimalProfileResponse } from '../../types/animal/animal.types.ts';
import '../../style/AnimalDetails.scss';

export default function AnimalDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState<AnimalProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});

    useEffect(() => {
        loadAnimal();
        loadImagesFromStorage();
    }, [id]);

    const loadImagesFromStorage = () => {
        const storedImages = localStorage.getItem('animalImages');
        if (storedImages) {
            const parsed = JSON.parse(storedImages);
            setAnimalImages(parsed);
        }
    };

    const loadAnimal = async () => {
        setIsLoading(true);
        try {
            if (id) {
                const response = await getAnimalProfile(Number(id));
                setAnimal(response.data);
                console.log('Загружено животное:', response.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки животного:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAnimalImage = () => {
        if (!animal) return null;
        const uniqueKey = `${animal.name}_${animal.breed}_${animal.age}`;
        return animalImages[uniqueKey] || null;
    };

    const getAgeText = (age: number) => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const getGenderIcon = (gender: string) => gender === 'MAN' ? '♂️' : '♀️';
    const getGenderText = (gender: string) => gender === 'MAN' ? 'Мальчик' : 'Девочка';

    const getTypeText = (type: string) => type === 'DOG' ? 'Собака' : 'Кошка';
    const getTypeIcon = (type: string) => type === 'DOG' ? '🐕' : '🐈';

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Не указано';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const image = getAnimalImage();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (!animal) {
        return (
            <div className="error-container">
                <h2>Животное не найдено</h2>
                <button onClick={() => navigate('/main')} className="back-btn">
                    ← Вернуться
                </button>
            </div>
        );
    }

    return (
        <>
            <header className="animal-header">
                <button onClick={() => navigate('/main')} className="back-btn">
                    ← Назад
                </button>
                <div className="logo">Adoptly</div>
                <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
            </header>

            <main className="animal-details-container">
                <div className="animal-card-details">
                    <div className="animal-image-section">
                        {image ? (
                            <img
                                src={image}
                                alt={animal.name}
                                className="main-image"
                            />
                        ) : (
                            <div className="image-placeholder">
                                <span className="animal-emoji">
                                    {getTypeIcon(animal.animalType)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="animal-info-section">
                        <h1>
                            {animal.name}
                            <span className="gender-icon">{getGenderIcon(animal.gender)}</span>
                        </h1>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">🐾 Порода</span>
                                <span className="info-value">{animal.breed}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">📅 Возраст</span>
                                <span className="info-value">{getAgeText(animal.age)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">⚥ Пол</span>
                                <span className="info-value">{getGenderText(animal.gender)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">🐶 Тип</span>
                                <span className="info-value">{getTypeText(animal.animalType)}</span>
                            </div>
                        </div>

                        <div className="description-section">
                            <h3>📝 Описание</h3>
                            <p>{animal.description || 'Нет описания'}</p>
                        </div>

                        <div className="extra-info">
                            <div className="extra-item">
                                <span>👤 Хозяин</span>
                                <span>{animal.ownerName || 'Не указан'}</span>
                            </div>
                            <div className="extra-item">
                                <span>📅 Добавлен</span>
                                <span>{formatDate(animal.createAt)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => animal.ownerId && navigate(`/owner/${animal.ownerId}`)}
                            className="contact-btn"
                        >
                            📞 Связаться с владельцем
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}