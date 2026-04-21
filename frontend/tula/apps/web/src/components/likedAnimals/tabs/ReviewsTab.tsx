import React from 'react';
import type { UserProfileResponse } from '../../../api/userApi';

//type Review = UserProfileResponse['myReview'][number];

interface Props {
    profile: UserProfileResponse | null;
    formatDate: (date: string) => string;
}

const ReviewsTab: React.FC<Props> = ({ profile, formatDate }) => {
    const reviews = profile?.myReview || [];

    return (
        <div className="reviews-main">
            <h2>Мои отзывы</h2>

            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <span className="review-author">
                                    {profile?.name || 'Пользователь'}
                                </span>
                                <span className="review-rating">★★★★★</span>
                            </div>

                            <p className="review-text">{review.content}</p>

                            <span className="review-date">
                                {formatDate(review.createdAt)}
                            </span>
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
    );
};

export default ReviewsTab;