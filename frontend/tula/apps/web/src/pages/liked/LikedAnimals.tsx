import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, type UserProfileResponse, type Animal } from '../../api/userApi';
import { createOwner, getOwnerAnimals } from '../../api/ownerApi';
import type { CreateAnimalRequest } from '../../types/animal/animal.types';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/LikedAnimals.scss';
import QrCode from '../../components/qr/QrCode';
import { createAnimalWithImage, getAnimalImageUrl, deleteAnimal } from "../../api/animalApi";
import { deleteLike, getUserLikes } from "../../api/likeApi";
import { getFollowersCount } from "../../api/followApi";

// Импорт всех SVG иконок
import dogIcon from '../../assets/dog.svg';
import catIcon from '../../assets/cat.png';
import pawIcon from '../../assets/paw.svg';
import personIcon from '../../assets/person.svg';
import starIcon from '../../assets/star.svg';
import favoriteIcon from '../../assets/favorite.svg';
import chatIcon from '../../assets/chat.svg';
import adoptlyHouseIcon from '../../assets/adoptly-house.svg';
import createIcon from '../../assets/create.svg';
import creditCardIcon from '../../assets/credit-card.svg';
import maleIcon from '../../assets/male.svg';
import femaleIcon from '../../assets/female.svg';
import calendarIcon from '../../assets/calendar.svg';
import editDocumentIcon from '../../assets/edit-document.svg';
import flashUseIcon from '../../assets/flash-use.svg';

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
    const [followersCount, setFollowersCount] = useState<number | null>(null);
    const [currentFact, setCurrentFact] = useState(0);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);

    const facts = [
        { text: "Кошки спят около 16 часов в день" },
        { text: "Собаки понимают до 250 слов и жестов" },
        { text: "Коты могут издавать около 100 различных звуков" },
        { text: "Нос собаки уникален, как отпечаток пальца" },
        { text: "Кошки не чувствуют сладкий вкус" },
        { text: "Собаки видят сны так же, как люди" },
        { text: "У кошек 32 мышцы в каждом ухе" },
        { text: "Хвост собаки показывает её настроение" },
        { text: "Кошки мурлыкают на частоте, которая помогает заживлению костей" },
        { text: "Собаки могут чувствовать магнитное поле Земли" },
        { text: "Кошка может прыгнуть в 6 раз выше своего роста" },
        { text: "Собаки понимают человеческие эмоции по голосу" },
        { text: "Усы помогают кошкам ориентироваться в темноте" },
        { text: "Собаки бегают зигзагами, чтобы сбросить напряжение" }
    ];

    useEffect(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // Синхронизированный таймер для фактов и прогресс-бара
        const factInterval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % facts.length);
            setProgress(0);
        }, 8000);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + (100 / (8000 / 100));
            });
        }, 100);

        loadProfile();

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            clearInterval(factInterval);
            clearInterval(progressInterval);
        };
    }, []);

    useEffect(() => {
        if (ownerId) {
            loadFollowersCount();
        }
    }, [ownerId]);

    const loadFollowersCount = async () => {
        if (!ownerId) return;
        try {
            const response = await getFollowersCount(ownerId);
            console.log('Количество подписчиков:', response.data);
            setFollowersCount(response.data);
        } catch (error) {
            console.error('Ошибка загрузки подписчиков:', error);
            setFollowersCount(null);
        }
    };

    const checkOwner = async () => {
        try {
            const response = await getOwnerAnimals();
            if (response.data && response.status === 200 && response.data.length > 0) {
                setHasOwner(true);
                if (response.data[0]?.id) {
                    setOwnerId(response.data[0].id);
                }
                if (profile?.name) {
                    setOwnerName(profile.name);
                }
            } else {
                setHasOwner(false);
                setOwnerName('');
                setOwnerId(null);
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
                const likes = response.data.likeAnimals.map((animal: any) => ({
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

            await checkOwner();
            await loadMyAnimals();

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
            await loadMyAnimals();
            await loadProfile();
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
            const response = await createAnimalWithImage(data, imageFile);
            const newAnimal = response.data;

            if (newAnimal && newAnimal.id) {
                if (imageFile) {
                    const imageUrl = await getAnimalImageUrl(newAnimal.id);
                    if (imageUrl) {
                        setAnimalImages(prev => ({ ...prev, [newAnimal.id]: imageUrl }));
                    }
                }

                alert(`✅ Животное "${newAnimal.name}" успешно создано!`);

                await loadMyAnimals();
                await loadProfile();
                setActiveTab('mypets');
            } else {
                alert('❌ Сервер вернул некорректный ответ');
            }

        } catch (error: any) {
            console.error('Ошибка создания:', error);
            let errorMessage = 'Ошибка создания анкеты';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            alert(`❌ ${errorMessage}`);
        } finally {
            setIsCreatingAnimal(false);
        }
    };

    const handleDeleteAnimal = async (animalId: number, animalName: string) => {
        if (confirm(`Вы уверены, что хотите удалить животное "${animalName}"?`)) {
            setIsDeleting(animalId);
            try {
                try {
                    const userLikes = await getUserLikes();
                    const likeToDelete = userLikes.data.find(like => like.animalId === animalId);
                    if (likeToDelete) {
                        await deleteLike(animalId);
                        console.log(`Лайк на животное ${animalId} удалён`);
                    }
                } catch (likeError) {
                    console.log('Не удалось удалить лайк, продолжаем удаление животного');
                }

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
                if (error.response?.status === 500) {
                    alert('❌ Невозможно удалить питомца. Возможно, есть связанные данные. Попробуйте позже или обратитесь к администратору.');
                } else {
                    alert(`❌ Ошибка при удалении: ${error.response?.data?.message || error.message}`);
                }
            } finally {
                setIsDeleting(null);
            }
        }
    };

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

    const getGenderIcon = (gender: string) => {
        return gender === 'MAN' ?
            <img src={maleIcon} alt="Мужской" className="gender-svg-icon" /> :
            <img src={femaleIcon} alt="Женский" className="gender-svg-icon" />;
    };

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
            case 'DONT_TAKE': return 'Доступен';
            case 'TAKE': return 'Забран';
            case 'RESERVATION': return 'Резерв';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'DONT_TAKE': return 'available';
            case 'TAKE': return 'taken';
            case 'RESERVATION': return 'reservation';
            default: return '';
        }
    };

    const getFollowersText = (count: number | null) => {
        if (count === null) return '-- подписчиков';
        if (count === 1) return `${count} подписчик`;
        if (count >= 2 && count <= 4) return `${count} подписчика`;
        return `${count} подписчиков`;
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


            </header>

            <main className="liked-container">
                <aside className="sidebar">
                    <div className="user-info-sidebar">
                        <div className="user-avatar">
                            {profile?.name?.charAt(0) || <img src={personIcon} alt="Профиль" className="person-icon" />}
                        </div>
                        <h3>{profile?.name || 'Пользователь'}</h3>
                        <p>{profile?.email || 'email@example.com'}</p>
                        {hasOwner && ownerId && (
                            <div className="followers-info">
                                <img src={personIcon} alt="Подписчики" className="small-icon" />
                                <span className="followers-count-display">{getFollowersText(followersCount)}</span>
                            </div>
                        )}
                    </div>

                    <nav className="sidebar-nav">
                        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            <img src={personIcon} alt="Главная" className="nav-icon-img" /> Главная
                        </button>
                        <button className={`nav-item ${activeTab === 'mypets' ? 'active' : ''}`} onClick={() => setActiveTab('mypets')}>
                            <img src={pawIcon} alt="Питомцы" className="nav-icon-img" /> Мои питомцы
                        </button>
                        <button className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
                            <img src={starIcon} alt="Отзывы" className="nav-icon-img" /> Отзывы
                        </button>
                        <button className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                            <img src={favoriteIcon} alt="Понравившиеся" className="nav-icon-img" /> Понравившиеся
                        </button>
                        <button className={`nav-item ${activeTab === 'createShelter' ? 'active' : ''}`} onClick={() => setActiveTab('createShelter')}>
                            <img src={adoptlyHouseIcon} alt="Приют" className="nav-icon-img" /> Приют
                        </button>
                        <button className="nav-item" onClick={() => navigate('/chat')}>
                            <img src={chatIcon} alt="Чат" className="nav-icon-img" /> Чат
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
                                    <div className="stat-label">
                                         Понравилось животных
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{myAnimals.length}</div>
                                    <div className="stat-label">
                                         Моих питомцев
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{profile?.myReview?.length || 0}</div>
                                    <div className="stat-label">
                                         Моих отзывов
                                    </div>
                                </div>
                                {hasOwner && (
                                    <div className="stat-card">
                                        <div className="stat-number">{followersCount !== null ? followersCount : '--'}</div>
                                        <div className="stat-label">
                                            <img src={personIcon} alt="Подписчики" className="stat-icon" /> Подписчиков
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="fun-facts-section">
                                <div className="facts-header">
                                    <img src={flashUseIcon} alt="Факты" className="facts-icon-img" />
                                    <h3>Интересные факты о животных</h3>
                                </div>
                                <div className="fact-card">
                                    <p className="fact-text">{facts[currentFact].text}</p>
                                    <div className="fact-progress">
                                        <div className="fact-progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="quote-section">
                                <div className="quote-card">
                                    <img src={pawIcon} alt="Лапка" className="quote-icon-img" />
                                    <p className="quote-text">"Собака — единственное существо на земле, которое любит тебя больше, чем себя"</p>
                                    <span className="quote-author">— Джош Биллингс</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button onClick={() => navigate('/payments')} className="action-btn payments-btn">
                                    <img src={creditCardIcon} alt="Платежи" className="action-icon" /> История платежей
                                </button>
                                <button onClick={() => navigate('/subscription')} className="action-btn subscription-btn">
                                    <img src={starIcon} alt="Подписка" className="action-icon" /> Оформить подписку
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
                                                            <img src={animal.animalType === 'DOG' ? dogIcon : catIcon} alt={animal.animalType} className="placeholder-icon" />
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
                                                            disabled={isDeleting === animal.id}
                                                        >
                                                            {isDeleting === animal.id ? '⏳' : '🗑️'}
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
                                    <img src={adoptlyHouseIcon} alt="Приют" className="empty-icon" />
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
                                    {profile.myReview.map((review: any) => (
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
                                    <img src={starIcon} alt="Отзывы" className="empty-icon" />
                                    <p>У вас пока нет отзывов</p>
                                    <button className="add-btn">Оставить отзыв</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'liked' && (
                        <div className="liked-main">
                            <h2>Понравившиеся животные</h2>
                            {uniqueLikedAnimals.length === 0 ? (
                                <div className="empty-state">
                                    <img src={favoriteIcon} alt="Понравившиеся" className="empty-icon" />
                                    <p>Нет понравившихся животных</p>
                                    <button onClick={() => navigate('/main')} className="add-btn">
                                        <img src={pawIcon} alt="Лапка" className="btn-icon" /> Перейти к животным
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
                                                        <img src={animal.animalType === 'DOG' ? dogIcon : catIcon} alt={animal.animalType} className="placeholder-icon" />
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
                                                    ✕
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
                                                    <img src={calendarIcon} alt="Дата" className="date-icon" /> Лайк: {formatDate(animal.likedAt)}
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
                                        <img src={adoptlyHouseIcon} alt="Приют" className="shelter-icon-img" />
                                        <h2>Мой приют</h2>
                                    </div>
                                    <div className="shelter-details">
                                        <p className="shelter-name">
                                            <strong>Название:</strong> {ownerName || profile?.name || 'Название не указано'}
                                        </p>
                                        {followersCount !== null && followersCount > 0 && (
                                            <div className="followers-stats">
                                                <img src={personIcon} alt="Подписчики" className="small-icon" />
                                                <span>{getFollowersText(followersCount)}</span>
                                            </div>
                                        )}
                                        <button onClick={() => setActiveTab('mypets')} className="my-pets-btn">
                                            <img src={pawIcon} alt="Питомцы" className="btn-icon" /> Мои питомцы ({myAnimals.length})
                                        </button>

                                        {ownerName && (
                                            <QrCode ownerId={ownerId || 0} ownerName={ownerName} />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="shelter-form-card">
                                    <div className="shelter-header">
                                        <img src={adoptlyHouseIcon} alt="Приют" className="shelter-icon-img" />
                                        <h2>Создать приют</h2>
                                    </div>
                                    <form onSubmit={handleCreateShelter} className="shelter-form">
                                        <div className="form-group">
                                            <label><img src={editDocumentIcon} alt="Название" className="label-icon" /> Название приюта</label>
                                            <input
                                                type="text"
                                                placeholder="Например: Добрые лапы"
                                                value={shelterName}
                                                onChange={(e) => setShelterName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn" disabled={isCreatingShelter}>
                                            {isCreatingShelter ? 'Создание...' : 'Создать приют'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="divider"></div>

                            <div className="create-animal-section">
                                <div className="create-animal-header">
                                    <img src={createIcon} alt="Добавить" className="animal-icon-img" />
                                    <h3>Добавить питомца</h3>
                                </div>
                                <p>Заполните форму чтобы добавить питомца в ленту</p>
                                <CreateAnimalForm onSubmit={handleCreateAnimal} isLoading={isCreatingAnimal} />
                            </div>h
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}