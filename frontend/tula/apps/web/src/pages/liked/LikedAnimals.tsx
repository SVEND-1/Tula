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

export default function LikedAnimals() {
    const [likedAnimals, setLikedAnimals] = useState<LikedAnimal[]>([]);
    const [animalImages, setAnimalImages] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    useEffect(() => {
        // Убираем overflow hidden у body и html при заходе на страницу
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        loadLikedAnimals();
        loadImagesFromStorage();

        // Возвращаем обратно при выходе со страницы
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

    const loadLikedAnimals = () => {
        const storedLikes = localStorage.getItem('likedAnimals');
        if (storedLikes) {
            const parsed = JSON.parse(storedLikes);
            setLikedAnimals(parsed);
            console.log('Загружены лайкнутые животные:', parsed);
        } else {
            setLikedAnimals([]);
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
                <div className="profile" onClick={() => navigate('/profile')}>Профиль</div>
            </header>

            <main className="liked-container">
                <h1 className="liked-title">❤️ Понравившиеся животные</h1>

                {likedAnimals.length === 0 ? (
                    <div className="empty-liked">
                        <span className="empty-emoji">😢</span>
                        <h2>Нет понравившихся животных</h2>
                        <p>Лайкайте животных на главной странице, они появятся здесь</p>
                        <button onClick={() => navigate('/main')} className="go-main-btn">
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
                                        ❤️ Лайк поставлен: {formatDate(animal.likedAt)}
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
            </main>
        </>
    );
}