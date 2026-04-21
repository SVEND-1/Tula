
import { useLikedAnimals, FACTS } from './useLikedAnimals';
import CreateAnimalForm from '../../components/admin/CreateAnimalForm';
import '../../style/LikedAnimals.scss';

export default function LikedAnimals() {
    const {
        profile,
        myAnimals,
        isLoading,
        activeTab,
        isCreatingAnimal,
        shelterName,
        isCreatingShelter,
        hasOwner,
        ownerName,
        currentFact,
        uniqueLikedAnimals,
        navigate,
        setActiveTab,
        setShelterName,
        handleCreateShelter,
        handleCreateAnimal,
        getAnimalImage,
        getAgeText,
        getGenderIcon,
        getGenderText,
        formatDate,
        getStatusText,
        getStatusClass,
    } = useLikedAnimals();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-animation">
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className={`floating-shape shape-bg-${i + 1}`} />
                ))}
            </div>

            <header className="liked-header">
                <button onClick={() => navigate('/main')} className="back-btn">← Назад</button>
                <div className="logo">Adoptly</div>
                <div className="profile-avatar-small" onClick={() => setActiveTab('profile')}>
                    {profile?.name?.charAt(0) || '👤'}
                </div>
            </header>

            <main className="liked-container">
                {/* Боковое меню */}
                <aside className="sidebar">
                    <div className="user-info-sidebar">
                        <div className="user-avatar">{profile?.name?.charAt(0) || '👤'}</div>
                        <h3>{profile?.name || 'Пользователь'}</h3>
                        <p>{profile?.email || 'email@example.com'}</p>
                    </div>

                    <nav className="sidebar-nav">
                        {([
                            { tab: 'profile',       icon: '👤', label: 'Главная' },
                            { tab: 'mypets',        icon: '🐕', label: 'Мои питомцы' },
                            { tab: 'reviews',       icon: '⭐', label: 'Отзывы' },
                            { tab: 'liked',         icon: '❤️', label: 'Понравившиеся' },
                            { tab: 'createShelter', icon: '🏠', label: 'Приют' },
                        ] as const).map(({ tab, icon, label }) => (
                            <button
                                key={tab}
                                className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <span className="nav-icon">{icon}</span> {label}
                            </button>
                        ))}
                        <button className="nav-item" onClick={() => navigate('/chat')}>
                            <span className="nav-icon">💬</span> Чат
                        </button>
                    </nav>
                </aside>

                <div className="main-content">

                    {/* Вкладка: Главная */}
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
                                    <div className="fact-emoji">{FACTS[currentFact].emoji}</div>
                                    <p className="fact-text">{FACTS[currentFact].text}</p>
                                    <div className="fact-progress">
                                        <div className="fact-progress-bar" style={{ width: '100%', animation: 'progress 8s linear infinite' }} />
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

                    {/* Вкладка: Мои питомцы */}
                    {activeTab === 'mypets' && (
                        <div className="mypets-main">
                            <h2>Мои питомцы</h2>
                            {hasOwner && myAnimals.length > 0 ? (
                                <>
                                    <div className="pets-grid">
                                        {myAnimals.map(animal => (
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

                    {/* Вкладка: Отзывы */}
                    {activeTab === 'reviews' && (
                        <div className="reviews-main">
                            <h2>Мои отзывы</h2>
                            {profile?.myReview && profile.myReview.length > 0 ? (
                                <div className="reviews-list">
                                    {profile.myReview.map(review => (
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

                    {/* Вкладка: Понравившиеся */}
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
                                    {uniqueLikedAnimals.map(animal => (
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
                                                <div className="liked-date">❤️ Лайк: {formatDate(animal.likedAt)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Вкладка: Приют */}
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
                                                onChange={e => setShelterName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn" disabled={isCreatingShelter}>
                                            {isCreatingShelter ? 'Создание...' : '✨ Создать приют'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="divider" />

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
