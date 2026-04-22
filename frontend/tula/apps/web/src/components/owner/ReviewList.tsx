import React from 'react';
import type { Review } from '../../api/reviewApi';

interface Props {
    reviews: Review[];
    formatDate: (dateString: string) => string;
}

// Список отзывов или заглушка если отзывов нет
const ReviewList: React.FC<Props> = ({ reviews, formatDate }) => (
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
);

export default ReviewList;
