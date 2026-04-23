import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnimalProfile, getAnimalImageUrl } from '../../api/animalApi';
import type { AnimalProfileResponse } from '../../types/animal/animal.types.ts';
import '../../style/AnimalDetails.scss';

export default function AnimalDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState<AnimalProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [animalImage, setAnimalImage] = useState<string | null>(null);

    useEffect(() => {
        loadAnimal();
    }, [id]);

    const loadAnimal = async () => {
        setIsLoading(true);
        try {
            if (id) {
                const response = await getAnimalProfile(Number(id));
                setAnimal(response.data);

                // Загружаем картинку
                const imageUrl = await getAnimalImageUrl(Number(id));
                if (imageUrl) {
                    setAnimalImage(imageUrl);
                }

                console.log('Загружено животное:', response.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки животного:', error);
        } finally {
            setIsLoading(false);
        }
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
                        {animalImage ? (
                            <img
                                src={animalImage}
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

                        <div className="info-row">
                            <span className="info-tag">{animal.breed}</span>
                            <span className="info-tag">{getAgeText(animal.age)}</span>
                            <span className="info-tag">{getGenderText(animal.gender)}</span>
                            <span className="info-tag">{getTypeText(animal.animalType)}</span>
                        </div>

                        <div className="description-section">
                            <p>{animal.description || 'Нет описания'}</p>
                        </div>

                        <div className="owner-info">
                            <div className="owner-item">
                                <span className="owner-label">👤 Хозяин</span>
                                <span className="owner-value">{animal.ownerName || 'Не указан'}</span>
                            </div>
                            <div className="owner-item">
                                <span className="owner-label">📅 Добавлен</span>
                                <span className="owner-value">{formatDate(animal.createAt)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => animal.ownerId && navigate(`/owner/${animal.ownerId}`)}
                            className="contact-btn"
                        >
                            Перейти к владельцу
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}