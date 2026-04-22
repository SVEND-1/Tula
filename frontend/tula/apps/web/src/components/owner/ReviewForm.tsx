import React from 'react';

interface Props {
    value: string;
    isSubmitting: boolean;
    onChange: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

// Форма добавления отзыва о приюте
const ReviewForm: React.FC<Props> = ({ value, isSubmitting, onChange, onSubmit }) => (
    <div className="add-review-form">
        <h3>Оставить отзыв</h3>
        <form onSubmit={onSubmit}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Поделитесь своим опытом общения с приютом..."
                rows={4}
                disabled={isSubmitting}
            />
            <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : '✍️ Оставить отзыв'}
            </button>
        </form>
    </div>
);

export default ReviewForm;
