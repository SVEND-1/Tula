
import { useOwner } from './useOwner';
import QrCode from '../../components/qr/QrCode';
import '../../style/OwnerProfile.scss';

export default function OwnerProfile() {
    const {
        id,
        profile,
        reviews,
        isLoading,
        showLeftArrow,
        showRightArrow,
        reviewText,
        isSubmitting,
        navigate,
        setReviewText,
        handleAddReview,
        getAnimalImage,
        formatDate,
        scrollLeft,
        scrollRight,
    } = useOwner();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="error-container">
                <h2>Приют не найден</h2>
                <button onClick={() => navigate('/main')} className="back-btn">
                    ← Вернуться
                </button>
            </div>
        );
    }

    return (
        <>
            <header className="owner-header">
                <button onClick={() => navigate('/main')} className="back-btn">← Назад</button>
                <div className="logo">Adoptly</div>
                <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
            </header>

            <div className="owner-section">
                <h2 className="section-title">Поделиться</h2>
                <QrCode ownerId={Number(id)} ownerName={profile.name} />
            </div>

            <main className="owner-container">
                <div className="owner-card">
                    <h1 className="owner-title">{profile.name}</h1>

                    {/* Слайдер животных */}
                    <div className="owner-section">
                        <h2 className="section-title">Животные</h2>
                        <div className="animals-slider">
                            <button
                                className={`slider-arrow left ${showLeftArrow ? 'visible' : ''}`}
                                onClick={scrollLeft}
                            >‹</button>

                            <div className="animals-track" id="animals-track">
                                {profile.animals?.map((animal) => (
                                    <div
                                        key={animal.id}
                                        className="animal-item"
                                        onClick={() => navigate(`/animal/${animal.id}`)}
                                    >
                                        <div className="animal-image">
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
                                        <div className="animal-name">{animal.name}</div>
                                        <div className="animal-breed">{animal.breed}</div>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`slider-arrow right ${showRightArrow ? 'visible' : ''}`}
                                onClick={scrollRight}
                            >›</button>
                        </div>
                    </div>

                    {/* Отзывы */}
                    <div className="owner-section">
                        <h2 className="section-title">Отзывы</h2>

                        <div className="add-review-form">
                            <h3>Оставить отзыв</h3>
                            <form onSubmit={handleAddReview}>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Поделитесь своим опытом общения с приютом..."
                                    rows={4}
                                    disabled={isSubmitting}
                                />
                                <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Отправка...' : '✍️ Оставить отзыв'}
                                </button>
                            </form>
                        </div>

                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-content">{review.content}</div>
                                        <div className="review-date">{formatDate(review.createdAt)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-reviews">
                                    <p>Нет отзывов</p>
                                    <span>Будьте первым, кто оставит отзыв!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
