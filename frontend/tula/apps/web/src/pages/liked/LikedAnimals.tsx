import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, type UserProfileResponse, type Animal } from '../../api/userApi';
import { createOwner, getOwnerAnimals } from '../../api/ownerApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/LikedAnimals.scss';
import QrCode from '../../components/qr/QrCode';
import { createAnimalWithImage, getAnimalImageUrl, deleteAnimal } from "../../api/animalApi";
import { deleteLike } from "../../api/likeApi";

interface LikedAnimal {
    id: number;
    name: string;
    breed: string;
    age: number;
    description: string;
    gender: string;
    animalType: string;
    status: string;
    likedAt: string;
}

interface MyAnimal {
    id: number;
    name: string;
    breed: string;
    age: number;
    description: string;
    gender: string;
    animalType: string;
    status: string;
}

type ActiveTab = 'profile' | 'mypets' | 'reviews' | 'liked' | 'createShelter';

export default function LikedAnimals() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [likedAnimals, setLikedAnimals] = useState<LikedAnimal[]>([]);
    const [myAnimals, setMyAnimals] = useState<MyAnimal[]>([]);
    const [animalImages, setAnimalImages] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [isCreatingAnimal, setIsCreatingAnimal] = useState(false);
    const [shelterName, setShelterName] = useState('');
    const [isCreatingShelter, setIsCreatingShelter] = useState(false);
    const [hasOwner, setHasOwner] = useState(false);
    const [ownerName, setOwnerName] = useState('');
    const [ownerId, setOwnerId] = useState<number | null>(null);
    const [currentFact, setCurrentFact] = useState(0);

    const facts = [
        { text: "🐱 Кошки спят около 16 часов в день", emoji: "😴" },
        { text: "🐶 Собаки понимают до 250 слов и жестов", emoji: "🧠" },
        { text: "🐱 Коты могут издавать около 100 различных звуков", emoji: "🎵" },
        { text: "🐶 Нос собаки уникален, как отпечаток пальца", emoji: "👃" },
        { text: "🐱 Кошки не чувствуют сладкий вкус", emoji: "🍬" },
        { text: "🐶 Собаки видят сны так же, как люди", emoji: "💭" },
        { text: "🐱 У кошек 32 мышцы в каждом ухе", emoji: "👂" },
        { text: "🐶 Хвост собаки показывает её настроение", emoji: "🐕" },
        { text: "🐱 Кошки мурлыкают на частоте, которая помогает заживлению костей", emoji: "💚" },
        { text: "🐶 Собаки могут чувствовать магнитное поле Земли", emoji: "🧲" },
        { text: "🐱 Кошка может прыгнуть в 6 раз выше своего роста", emoji: "🦘" },
        { text: "🐶 Собаки понимают человеческие эмоции по голосу", emoji: "❤️" },
        { text: "🐱 Усы помогают кошкам ориентироваться в темноте", emoji: "🌙" },
        { text: "🐶 Собаки бегают зигзагами, чтобы сбросить напряжение", emoji: "⚡" }
    ];

    useEffect(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        const interval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % facts.length);
        }, 8000);

        loadProfile();
        checkOwner();
        loadMyAnimals();

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            clearInterval(interval);
        };
    }, []);

    const checkOwner = async () => {
        try {
            const response = await getOwnerAnimals();
            if (response.data && response.status === 200) {
                setHasOwner(true);
                if (response.data.length > 0 && response.data[0]?.id) {
                    setOwnerId(response.data[0].id);
                }
                if (profile?.name) {
                    setOwnerName(profile.name);
                }
            }
        } catch (error) {
            setHasOwner(false);
            setOwnerName('');
            setOwnerId(null);
        }
    };

    const loadMyAnimals = async () => {
        try {
            const response = await getOwnerAnimals();
            if (response.data && response.data.length > 0) {
                const animals = response.data.map((animal: any) => ({
                    id: animal.id,
                    name: animal.name,
                    breed: animal.breed,
                    age: animal.age,
                    description: animal.description || '',
                    gender: animal.gender,
                    animalType: animal.animalType,
                    status: animal.status
                }));
                setMyAnimals(animals);

                for (const animal of animals) {
                    const imageUrl = await getAnimalImageUrl(animal.id);
                    if (imageUrl) {
                        setAnimalImages(prev => ({ ...prev, [animal.id]: imageUrl }));
                    }
                }
            } else {
                setMyAnimals([]);
            }
        } catch (error) {
            console.error('Ошибка загрузки моих животных:', error);
            setMyAnimals([]);
        }
    };

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const response = await getUserProfile();
            setProfile(response.data);
            console.log('Профиль из бэкенда:', response.data);

            if (response.data.likeAnimals && response.data.likeAnimals.length > 0) {
                const likes = response.data.likeAnimals.map(animal => ({
                    id: animal.id,
                    name: animal.name,
                    breed: animal.breed,
                    age: animal.age,
                    description: animal.description,
                    gender: animal.gender,
                    animalType: animal.animalType,
                    status: animal.status,
                    likedAt: animal.createAt
                }));
                setLikedAnimals(likes);

                for (const animal of likes) {
                    const imageUrl = await getAnimalImageUrl(animal.id);
                    if (imageUrl) {
                        setAnimalImages(prev => ({ ...prev, [animal.id]: imageUrl }));
                    }
                }
            } else {
                setLikedAnimals([]);
            }

            if (response.data.name) {
                setOwnerName(response.data.name);
            }
        } catch (error: any) {
            console.error('Ошибка загрузки профиля:', error);
            setLikedAnimals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateShelter = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingShelter(true);
        try {
            await createOwner(shelterName);
            setOwnerName(shelterName);
            alert('✅ Приют успешно создан! Теперь вы можете добавлять питомцев');
            setShelterName('');
            setHasOwner(true);
            setActiveTab('mypets');
        } catch (error: any) {
            console.error('Ошибка создания приюта:', error);
            alert('❌ Ошибка создания приюта');
        } finally {
            setIsCreatingShelter(false);
        }
    };

    const handleCreateAnimal = async (data: CreateAnimalRequest, imageFile?: File) => {
        setIsCreatingAnimal(true);
        try {
            console.log('=== ОТПРАВКА ДАННЫХ ===');
            console.log('Данные животного:', data);
            console.log('Файл картинки:', imageFile?.name);

            const response = await createAnimalWithImage(data, imageFile);

            console.log('=== ОТВЕТ СЕРВЕРА ===');
            console.log('Статус:', response.status);
            console.log('Данные:', response.data);

            const newAnimal = response.data;

            if (newAnimal && newAnimal.id) {
                console.log(`Животное создано с ID: ${newAnimal.id}`);

                if (imageFile) {
                    const imageUrl = await getAnimalImageUrl(newAnimal.id);
                    if (imageUrl) {
                        console.log('URL картинки получен:', imageUrl);
                        setAnimalImages(prev => ({ ...prev, [newAnimal.id]: imageUrl }));
                    }
                }

                alert(`✅ Животное "${newAnimal.name}" успешно создано!`);

                await loadMyAnimals();
                await loadProfile();
                setActiveTab('mypets');
            } else {
                console.error('Некорректный ответ от сервера:', newAnimal);
                alert('❌ Сервер вернул некорректный ответ');
            }

        } catch (error: any) {
            console.error('=== ОШИБКА ===');
            console.error('Статус ошибки:', error.response?.status);
            console.error('Тело ошибки:', error.response?.data);

            let errorMessage = 'Ошибка создания анкеты';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errorMessage) {
                errorMessage = error.response.data.errorMessage;
            }

            alert(`❌ ${errorMessage}`);
        } finally {
            setIsCreatingAnimal(false);
        }
    };

    const handleDeleteAnimal = async (animalId: number, animalName: string) => {
        if (confirm(`Вы уверены, что хотите удалить животное "${animalName}"?`)) {
            try {
                await deleteAnimal(animalId);
                alert('✅ Животное удалено!');

                setAnimalImages(prev => {
                    const newState = { ...prev };
                    delete newState[animalId];
                    return newState;
                });

                await loadMyAnimals();
                await loadProfile();
            } catch (error: any) {
                console.error('Ошибка удаления:', error);
                alert('❌ Ошибка при удалении');
            }
        }
    };

    // ========== УДАЛЕНИЕ ЛАЙКА ==========
    const handleDeleteLike = async (animalId: number, animalName: string) => {
        if (confirm(`Вы уверены, что хотите удалить лайк у "${animalName}"?`)) {
            try {
                await deleteLike(animalId);
                alert('✅ Лайк удалён!');

                setLikedAnimals(prev => prev.filter(animal => animal.id !== animalId));
                await loadProfile();

            } catch (error: any) {
                console.error('Ошибка удаления лайка:', error);
                alert('❌ Ошибка при удалении лайка');
            }
        }
    };

    const getAnimalImage = (animal: LikedAnimal | MyAnimal | Animal) => {
        return animalImages[animal.id] || null;
    };

    const uniqueLikedAnimals = useMemo(() => {
        if (!likedAnimals.length) return [];
        const seen = new Set();
        return likedAnimals.filter(animal => {
            if (seen.has(animal.id)) {
                return false;
            }
            seen.add(animal.id);
            return true;
        });
    }, [likedAnimals]);

    const getAgeText = (age: number) => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const getGenderIcon = (gender: string) => gender === 'MAN' ? '♂️' : '♀️';
    const getGenderText = (gender: string) => gender === 'MAN' ? 'Мальчик' : 'Девочка';

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Не указано';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
            case 'AVAILABLE': return 'available';
            case 'TAKEN': return 'taken';
            case 'VERIFICATION': return 'verification';
            default: return '';
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-animation">
                <div className="floating-shape shape-bg-1"></div>
                <div className="floating-shape shape-bg-2"></div>
                <div className="floating-shape shape-bg-3"></div>
                <div className="floating-shape shape-bg-4"></div>
                <div className="floating-shape shape-bg-5"></div>
            </div>

            <header className="liked-header">
                <button onClick={() => navigate('/main')} className="back-btn">
                    ← Назад
                </button>
                <div className="logo">Adoptly</div>
                <div className="profile-avatar-small" onClick={() => setActiveTab('profile')}>
                    {profile?.name?.charAt(0) || '👤'}
                </div>
            </header>

            <main className="liked-container">
                <aside className="sidebar">
                    <div className="user-info-sidebar">
                        <div className="user-avatar">
                            {profile?.name?.charAt(0) || '👤'}
                        </div>
                        <h3>{profile?.name || 'Пользователь'}</h3>
                        <p>{profile?.email || 'email@example.com'}</p>
                    </div>

                    <nav className="sidebar-nav">
                        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            <span className="nav-icon">👤</span> Главная
                        </button>
                        <button className={`nav-item ${activeTab === 'mypets' ? 'active' : ''}`} onClick={() => setActiveTab('mypets')}>
                            <span className="nav-icon">🐕</span> Мои питомцы
                        </button>
                        <button className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
                            <span className="nav-icon">⭐</span> Отзывы
                        </button>
                        <button className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                            <span className="nav-icon">❤️</span> Понравившиеся
                        </button>
                        <button className={`nav-item ${activeTab === 'createShelter' ? 'active' : ''}`} onClick={() => setActiveTab('createShelter')}>
                            <span className="nav-icon">🏠</span> Приют
                        </button>
                        <button className="nav-item" onClick={() => navigate('/chat')}>
                            <span className="nav-icon">💬</span> Чат
                        </button>
                    </nav>
                </aside>

                <div className="main-content">
                    {activeTab === 'profile' && (
                        <div className="profile-main">
                            <div className="welcome-card">
                                <h1>Добро пожаловать, {profile?.name || 'Пользователь'}!</h1>
                                <p>Ваш профиль и статистика</p>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-number">{uniqueLikedAnimals.length}</div>
                                    <div className="stat-label">Понравилось животных</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{myAnimals.length}</div>
                                    <div className="stat-label">Моих питомцев</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{profile?.myReview?.length || 0}</div>
                                    <div className="stat-label">Моих отзывов</div>
                                </div>
                            </div>

                            <div className="fun-facts-section">
                                <div className="facts-header">
                                    <span className="facts-icon">📖</span>
                                    <h3>Интересные факты о животных</h3>
                                </div>
                                <div className="fact-card">
                                    <div className="fact-emoji">{facts[currentFact].emoji}</div>
                                    <p className="fact-text">{facts[currentFact].text}</p>
                                    <div className="fact-progress">
                                        <div className="fact-progress-bar" style={{ width: '100%', animation: 'progress 8s linear infinite' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="quote-section">
                                <div className="quote-card">
                                    <span className="quote-icon">🐾</span>
                                    <p className="quote-text">"Собака — единственное существо на земле, которое любит тебя больше, чем себя"</p>
                                    <span className="quote-author">— Джош Биллингс</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button onClick={() => navigate('/payments')} className="action-btn payments-btn">
                                    💳 История платежей
                                </button>
                                <button onClick={() => navigate('/subscription')} className="action-btn subscription-btn">
                                    ⭐ Оформить подписку
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mypets' && (
                        <div className="mypets-main">
                            <h2>Мои питомцы</h2>
                            {hasOwner && myAnimals.length > 0 ? (
                                <>
                                    <div className="pets-grid">
                                        {myAnimals.map((animal) => (
                                            <div key={animal.id} className="pet-card">
                                                <div className="pet-card-image">
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
                                                <div className="pet-card-info">
                                                    <h4>{animal.name}</h4>
                                                    <p>{animal.breed} • {getAgeText(animal.age)}</p>
                                                    <span className={`status-badge ${getStatusClass(animal.status)}`}>
                                                        {getStatusText(animal.status)}
                                                    </span>
                                                    <div className="pet-card-actions">
                                                        <button
                                                            onClick={() => handleDeleteAnimal(animal.id, animal.name)}
                                                            className="delete-btn"
                                                            title="Удалить"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-animal-section">
                                        <button onClick={() => setActiveTab('createShelter')} className="add-animal-btn">
                                            + Добавить питомца
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="empty-state">
                                    <span>🏠</span>
                                    <p>У вас пока нет приюта</p>
                                    <button onClick={() => setActiveTab('createShelter')} className="add-btn">
                                        + Создать приют
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-main">
                            <h2>Мои отзывы</h2>
                            {profile?.myReview && profile.myReview.length > 0 ? (
                                <div className="reviews-list">
                                    {profile.myReview.map((review) => (
                                        <div key={review.id} className="review-card">
                                            <div className="review-header">
                                                <span className="review-author">{profile.name}</span>
                                                <span className="review-rating">★★★★★</span>
                                            </div>
                                            <p className="review-text">{review.content}</p>
                                            <span className="review-date">{formatDate(review.createdAt)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <span>⭐</span>
                                    <p>У вас пока нет отзывов</p>
                                    <button className="add-btn">✍️ Оставить отзыв</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'liked' && (
                        <div className="liked-main">
                            <h2>Понравившиеся животные</h2>
                            {uniqueLikedAnimals.length === 0 ? (
                                <div className="empty-state">
                                    <span>❤️</span>
                                    <p>Нет понравившихся животных</p>
                                    <button onClick={() => navigate('/main')} className="add-btn">
                                        🐾 Перейти к животным
                                    </button>
                                </div>
                            ) : (
                                <div className="liked-grid">
                                    {uniqueLikedAnimals.map((animal) => (
                                        <div key={animal.id} className="liked-card">
                                            <div className="liked-card-image">
                                                {getAnimalImage(animal) ? (
                                                    <img src={getAnimalImage(animal)!} alt={animal.name} />
                                                ) : (
                                                    <div className="image-placeholder">
                                                        <span className="animal-emoji">
                                                            {animal.animalType === 'DOG' ? '🐕' : '🐈'}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className={`status-badge ${getStatusClass(animal.status)}`}>
                                                    {getStatusText(animal.status)}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteLike(animal.id, animal.name)}
                                                    className="delete-like-btn"
                                                    title="Удалить лайк"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                            <div className="liked-card-info">
                                                <h3>
                                                    {animal.name}
                                                    <span className="gender-icon">{getGenderIcon(animal.gender)}</span>
                                                </h3>
                                                <div className="details">
                                                    <span>{animal.breed}</span>
                                                    <span>•</span>
                                                    <span>{getAgeText(animal.age)}</span>
                                                    <span>•</span>
                                                    <span>{getGenderText(animal.gender)}</span>
                                                </div>
                                                <p className="description">{animal.description}</p>
                                                <div className="liked-date">
                                                    ❤️ Лайк: {formatDate(animal.likedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'createShelter' && (
                        <div className="create-shelter-main">
                            {hasOwner ? (
                                <div className="shelter-info-card">
                                    <div className="shelter-header">
                                        <span className="shelter-icon">🏠</span>
                                        <h2>Мой приют</h2>
                                    </div>
                                    <div className="shelter-details">
                                        <p className="shelter-name">
                                            <strong>Название:</strong> {ownerName || profile?.name || 'Название не указано'}
                                        </p>
                                        <button onClick={() => setActiveTab('mypets')} className="my-pets-btn">
                                            🐕 Мои питомцы ({myAnimals.length})
                                        </button>

                                        {ownerName && (
                                            <QrCode ownerId={ownerId || 0} ownerName={ownerName} />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="shelter-form-card">
                                    <div className="shelter-header">
                                        <span className="shelter-icon">🏠</span>
                                        <h2>Создать приют</h2>
                                    </div>
                                    <form onSubmit={handleCreateShelter} className="shelter-form">
                                        <div className="form-group">
                                            <label>🏷️ Название приюта</label>
                                            <input
                                                type="text"
                                                placeholder="Например: Добрые лапы"
                                                value={shelterName}
                                                onChange={(e) => setShelterName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn" disabled={isCreatingShelter}>
                                            {isCreatingShelter ? 'Создание...' : '✨ Создать приют'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="divider"></div>

                            <div className="create-animal-section">
                                <div className="create-animal-header">
                                    <span className="animal-icon">📝</span>
                                    <h3>Добавить питомца</h3>
                                </div>
                                <p>Заполните форму чтобы добавить питомца в ленту</p>
                                <CreateAnimalForm onSubmit={handleCreateAnimal} isLoading={isCreatingAnimal} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}