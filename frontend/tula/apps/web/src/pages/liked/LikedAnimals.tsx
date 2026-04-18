import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, type UserProfileResponse, type Animal } from '../../api/userApi';
import { createOwner, getOwnerAnimals, createOwnerAnimal } from '../../api/ownerApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/LikedAnimals.scss';

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
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [likedAnimals, setLikedAnimals] = useState<LikedAnimal[]>([]);
    const [myAnimals, setMyAnimals] = useState<MyAnimal[]>([]);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [isCreatingAnimal, setIsCreatingAnimal] = useState(false);
    const [shelterName, setShelterName] = useState('');
    const [isCreatingShelter, setIsCreatingShelter] = useState(false);
    const [hasOwner, setHasOwner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        loadProfile();
        loadImagesFromStorage();
        checkOwner();
        loadMyAnimals();

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    const loadImagesFromStorage = () => {
        const storedImages = localStorage.getItem('animalImages');
        if (storedImages) {
            const parsed = JSON.parse(storedImages);
            setAnimalImages(parsed);
        }
    };

    const checkOwner = async () => {
        try {
            const response = await getOwnerAnimals();
            if (response.data && response.status === 200) {
                setHasOwner(true);
            }
        } catch (error) {
            setHasOwner(false);
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
                    description: animal.description,
                    gender: animal.gender,
                    animalType: animal.animalType,
                    status: animal.status
                }));
                setMyAnimals(animals);
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

            if (response.data.likeAnimals) {
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
            }
        } catch (error: any) {
            console.error('Ошибка загрузки профиля:', error);
            const storedLikes = localStorage.getItem('likedAnimals');
            if (storedLikes) {
                setLikedAnimals(JSON.parse(storedLikes));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateShelter = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingShelter(true);
        try {
            await createOwner(shelterName);
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

    const handleCreateAnimal = async (data: CreateAnimalRequest, imageBase64?: string) => {
        setIsCreatingAnimal(true);
        try {
            const response = await createOwnerAnimal(data);

            if (response.data) {
                const existingAnimals = localStorage.getItem('animalImages');
                const images = existingAnimals ? JSON.parse(existingAnimals) : {};
                images[response.data.id] = imageBase64 || '';
                localStorage.setItem('animalImages', JSON.stringify(images));

                alert(`✅ Животное "${response.data.name}" успешно создано! Оно появится в ленте`);
                await loadMyAnimals();
                await loadProfile();
                setActiveTab('mypets');
            }
        } catch (error: any) {
            console.error('Ошибка:', error);
            const errorMessage = error.response?.data?.message || 'Ошибка создания анкеты';
            alert(`❌ ${errorMessage}`);
        } finally {
            setIsCreatingAnimal(false);
        }
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

    const getAnimalImage = (animal: LikedAnimal | MyAnimal | Animal) => {
        const uniqueKey = `${animal.name}_${animal.breed}_${animal.age}`;
        return animalImages[uniqueKey] || null;
    };

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
                        <button
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <span className="nav-icon">👤</span>
                            Главная
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'mypets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mypets')}
                        >
                            <span className="nav-icon">🐕</span>
                            Мои питомцы
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <span className="nav-icon">⭐</span>
                            Отзывы
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`}
                            onClick={() => setActiveTab('liked')}
                        >
                            <span className="nav-icon">❤️</span>
                            Понравившиеся
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'createShelter' ? 'active' : ''}`}
                            onClick={() => setActiveTab('createShelter')}
                        >
                            <span className="nav-icon">🏠</span>
                            Создать приют
                        </button>
                        <button
                            className="nav-item"
                            onClick={() => navigate('/chat')}
                        >
                            <span className="nav-icon">💬</span>
                            Чат
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
                            <h2>🏠 Создать приют</h2>

                            {hasOwner ? (
                                <div className="shelter-exists">
                                    <span>✅</span>
                                    <p>У вас уже есть приют! Вы можете создавать питомцев.</p>
                                    <button onClick={() => setActiveTab('mypets')} className="add-btn">
                                        🐕 Мои питомцы
                                    </button>
                                </div>
                            ) : (
                                <div className="shelter-form-container">
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
                                <h3>📝 Добавить питомца</h3>
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