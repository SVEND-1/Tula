import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    owner?: {
        id: number;
        shelterName: string;
        phone: string;
        address: string;
    } | null;
}

type ActiveTab = 'profile' | 'mypets' | 'reviews' | 'liked';

export default function LikedAnimals() {
    const [likedAnimals, setLikedAnimals] = useState<LikedAnimal[]>([]);
    const [userAnimals, setUserAnimals] = useState<LikedAnimal[]>([]);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});
    const [user, setUser] = useState<User | null>(null);
    const [showShelterForm, setShowShelterForm] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [shelterData, setShelterData] = useState({
        shelterName: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        loadUserFromStorage();
        loadLikedAnimals();
        loadImagesFromStorage();
        loadUserAnimals();

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

    const loadUserFromStorage = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            console.log('Пользователь из localStorage:', parsed);
        } else {
            const testUser = {
                id: 1,
                email: 'test@example.com',
                name: 'Тестовый пользователь',
                role: 'USER'
            };
            setUser(testUser);
            localStorage.setItem('user', JSON.stringify(testUser));
        }
    };

    const loadLikedAnimals = () => {
        const storedLikes = localStorage.getItem('likedAnimals');
        if (storedLikes) {
            const parsed = JSON.parse(storedLikes);
            setLikedAnimals(parsed);
        } else {
            setLikedAnimals([]);
        }
    };

    const loadUserAnimals = () => {
        const storedAnimals = localStorage.getItem('userAnimals');
        if (storedAnimals) {
            const parsed = JSON.parse(storedAnimals);
            setUserAnimals(parsed);
        }
    };

    const handleCreateShelter = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            const updatedUser = { ...user, owner: { id: Date.now(), ...shelterData } };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowShelterForm(false);
            alert('✅ Приют успешно создан!');
        }
    };

    const getAgeText = (age: number) => {
        if (age === 1) return `${age} год`;
        if (age < 5) return `${age} года`;
        return `${age} лет`;
    };

    const getGenderIcon = (gender: string) => gender === 'MAN' ? '♂️' : '♀️';
    const getGenderText = (gender: string) => gender === 'MAN' ? 'Мальчик' : 'Девочка';

    const getAnimalImage = (animal: LikedAnimal) => {
        const uniqueKey = `${animal.name}_${animal.breed}_${animal.age}`;
        return animalImages[uniqueKey] || null;
    };

    const removeFromLiked = (animalId: number) => {
        const updatedLikes = likedAnimals.filter(animal => animal.id !== animalId);
        setLikedAnimals(updatedLikes);
        localStorage.setItem('likedAnimals', JSON.stringify(updatedLikes));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <header className="liked-header">
                <button onClick={() => navigate('/main')} className="back-btn">
                    ← Назад
                </button>
                <div className="logo">Adoptly</div>
                <div className="profile-avatar-small" onClick={() => setActiveTab('profile')}>
                    {user?.name?.charAt(0) || '👤'}
                </div>
            </header>

            <main className="liked-container">
                <aside className="sidebar">
                    <div className="user-info-sidebar">
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || '👤'}
                        </div>
                        <h3>{user?.name || 'Пользователь'}</h3>
                        <p>{user?.email || 'email@example.com'}</p>
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
                                <h1>Добро пожаловать, {user?.name || 'Пользователь'}!</h1>
                                <p>Ваш профиль и статистика</p>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-number">{likedAnimals.length}</div>
                                    <div className="stat-label">Понравилось животных</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{userAnimals.length}</div>
                                    <div className="stat-label">Моих питомцев</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">0</div>
                                    <div className="stat-label">Завершённых заявок</div>
                                </div>
                            </div>

                            {!user?.owner && (
                                <div className="shelter-prompt">
                                    <h3>🏠 Создайте приют</h3>
                                    <p>Чтобы добавлять животных, создайте приют</p>
                                    <button
                                        className="create-shelter-prompt-btn"
                                        onClick={() => setShowShelterForm(!showShelterForm)}
                                    >
                                        + Создать приют
                                    </button>

                                    {showShelterForm && (
                                        <form onSubmit={handleCreateShelter} className="shelter-form-inline">
                                            <input
                                                type="text"
                                                placeholder="Название приюта"
                                                value={shelterData.shelterName}
                                                onChange={(e) => setShelterData({...shelterData, shelterName: e.target.value})}
                                                required
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Телефон"
                                                value={shelterData.phone}
                                                onChange={(e) => setShelterData({...shelterData, phone: e.target.value})}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Адрес"
                                                value={shelterData.address}
                                                onChange={(e) => setShelterData({...shelterData, address: e.target.value})}
                                                required
                                            />
                                            <button type="submit" className="submit-btn">
                                                ✅ Сохранить
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'mypets' && (
                        <div className="mypets-main">
                            <h2>Мои питомцы</h2>
                            {user?.owner ? (
                                <>
                                    {userAnimals.length === 0 ? (
                                        <div className="empty-state">
                                            <span>🐾</span>
                                            <p>У вас пока нет питомцев</p>
                                            <button onClick={() => navigate('/admin')} className="add-btn">
                                                + Добавить питомца
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="pets-grid">
                                            {userAnimals.map((animal) => (
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
                                                        <span className={`status-badge ${animal.status?.toLowerCase() || 'available'}`}>
                                                            {animal.status === 'AVAILABLE' ? 'Доступен' : 'Забран'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state">
                                    <span>🏠</span>
                                    <p>Сначала создайте приют</p>
                                    <button onClick={() => setActiveTab('profile')} className="add-btn">
                                        + Создать приют
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-main">
                            <h2>Отзывы</h2>
                            <div className="reviews-list">
                                <div className="review-card">
                                    <div className="review-header">
                                        <span className="review-author">Анна</span>
                                        <span className="review-rating">★★★★★</span>
                                    </div>
                                    <p className="review-text">Отличный сервис! Нашли своего питомца благодаря Adoptly. Спасибо!</p>
                                    <span className="review-date">15.04.2026</span>
                                </div>
                                <div className="review-card">
                                    <div className="review-header">
                                        <span className="review-author">Михаил</span>
                                        <span className="review-rating">★★★★☆</span>
                                    </div>
                                    <p className="review-text">Хороший сайт, много животных. Быстро нашли хозяев для наших котят.</p>
                                    <span className="review-date">10.04.2026</span>
                                </div>
                                <div className="review-card">
                                    <div className="review-header">
                                        <span className="review-author">Екатерина</span>
                                        <span className="review-rating">★★★★★</span>
                                    </div>
                                    <p className="review-text">Очень удобный интерфейс! Лайки и подбор животных работают отлично.</p>
                                    <span className="review-date">05.04.2026</span>
                                </div>
                            </div>
                            <button className="add-review-btn">✍️ Оставить отзыв</button>
                        </div>
                    )}

                    {activeTab === 'liked' && (
                        <div className="liked-main">
                            <h2>Понравившиеся животные</h2>
                            {likedAnimals.length === 0 ? (
                                <div className="empty-state">
                                    <span>❤️</span>
                                    <p>Нет понравившихся животных</p>
                                    <button onClick={() => navigate('/main')} className="add-btn">
                                        🐾 Перейти к животным
                                    </button>
                                </div>
                            ) : (
                                <div className="liked-grid">
                                    {likedAnimals.map((animal) => (
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
                                                <span className={`status-badge ${animal.status?.toLowerCase() || 'available'}`}>
                                                    {animal.status === 'AVAILABLE' ? 'Доступен' :
                                                        animal.status === 'TAKEN' ? 'Забран' : 'На проверке'}
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
                                                <button
                                                    onClick={() => removeFromLiked(animal.id)}
                                                    className="remove-btn"
                                                >
                                                    🗑️ Удалить
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}