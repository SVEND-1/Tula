
import { getAllAnimals } from '../../api/animalApi';
import type { Animal } from '../../types/animal/animal.types.ts';
import '../../style/MainPage.css';
import {useEffect, useState} from "react";

export default function MainPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'DOG' | 'CAT'>('ALL');

    useEffect(() => {
        loadAnimals();
    }, []);

    const loadAnimals = async () => {
        setIsLoading(true);
        try {
            const response = await getAllAnimals();
            console.log(' Загружены животные:', response.data);
            setAnimals(response.data);
        } catch (error: any) {
            console.error(' Ошибка загрузки:', error);
            alert('Ошибка загрузки списка животных');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAnimals = animals.filter(animal => {
        if (filter === 'ALL') return true;
        return animal.animalType === filter;
    });

    // Обновляем для MAN/WOMAN
    const getGenderIcon = (gender: string) => gender === 'MAN' ? '♂️' : '♀️';
    const getGenderText = (gender: string) => gender === 'MAN' ? 'Мальчик' : 'Девочка';

    const getStatusText = (status: string) => {
        switch(status) {
            case 'AVAILABLE': return 'Доступен';
            case 'TAKEN': return 'Забран';
            case 'VERIFICATION': return 'На проверке';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'AVAILABLE': return 'status-available';
            case 'TAKEN': return 'status-taken';
            case 'VERIFICATION': return 'status-verification';
            default: return '';
        }
    };

    return (
        <div className="main-container">
            <header className="main-header">
                <h1>🐾 Приют для животных</h1>
                <p>Подари дом братьям нашим меньшим</p>
            </header>

            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setFilter('ALL')}
                >
                    🏠 Все ({animals.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'DOG' ? 'active' : ''}`}
                    onClick={() => setFilter('DOG')}
                >
                    🐕 Собаки ({animals.filter(a => a.animalType === 'DOG').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'CAT' ? 'active' : ''}`}
                    onClick={() => setFilter('CAT')}
                >
                    🐈 Кошки ({animals.filter(a => a.animalType === 'CAT').length})
                </button>
            </div>

            {isLoading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Загрузка животных...</p>
                </div>
            ) : (
                <div className="animals-grid">
                    {filteredAnimals.map((animal) => (
                        <div key={animal.id} className="animal-card">
                            <div className="animal-image">
                                <div className="image-placeholder">
                                    <span className="animal-emoji">
                                        {animal.animalType === 'DOG' ? '🐕' : '🐈'}
                                    </span>
                                </div>
                                <span className={`status-badge ${getStatusClass(animal.status)}`}>
                                    {getStatusText(animal.status)}
                                </span>
                            </div>


                            <div className="animal-content">
                                <h3 className="animal-name">
                                    {animal.name}
                                    <span className="gender-icon">{getGenderIcon(animal.gender)}</span>
                                </h3>

                                <div className="animal-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">🐾</span>
                                        <span>{animal.breed}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">📅</span>
                                        <span>{animal.age} {animal.age === 1 ? 'год' : animal.age < 5 ? 'года' : 'лет'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">⚥</span>
                                        <span>{getGenderText(animal.gender)}</span>
                                    </div>
                                </div>

                                {animal.description && (
                                    <p className="animal-description">{animal.description}</p>
                                )}

                                <button className="adopt-btn">
                                    Хочу забрать
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && filteredAnimals.length === 0 && (
                <div className="empty-state">
                    <span className="empty-emoji">😢</span>
                    <h3>Животные не найдены</h3>
                    <p>Попробуйте изменить фильтр или зайдите позже</p>
                </div>
            )}
        </div>
    );
}