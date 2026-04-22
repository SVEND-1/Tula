
import { useOwner } from './useOwner';
import { QrCode } from '../../components/qr/QrCode';
import AnimalsSlider from '../../components/owner/AnimalsSlider';
import ReviewForm from '../../components/owner/ReviewForm';
import ReviewList from '../../components/owner/ReviewList';
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

                    <AnimalsSlider
                        animals={profile.animals ?? []}
                        showLeftArrow={showLeftArrow}
                        showRightArrow={showRightArrow}
                        getAnimalImage={getAnimalImage}
                        onAnimalClick={(id) => navigate(`/animal/${id}`)}
                        onScrollLeft={scrollLeft}
                        onScrollRight={scrollRight}
                    />

                    <div className="owner-section">
                        <h2 className="section-title">Отзывы</h2>

                        <ReviewForm
                            value={reviewText}
                            isSubmitting={isSubmitting}
                            onChange={setReviewText}
                            onSubmit={handleAddReview}
                        />

                        <ReviewList
                            reviews={reviews}
                            formatDate={formatDate}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
