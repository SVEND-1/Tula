import React from 'react';

interface Props {
    onLike: () => void;
    onDislike: () => void;
    disabled: boolean;
}

const SwipeButtons: React.FC<Props> = ({ onLike, onDislike, disabled }) => (
    <div className="buttons">
        <button onClick={onDislike} className="btn-dislike" disabled={disabled}>
            <svg viewBox="0 0 24 24" className="icon">
                <path d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </button>
        <button onClick={onLike} className="btn-like" disabled={disabled}>
            <svg viewBox="0 0 24 24" className="icon">
                <path d="M12 21s-7-4.6-9.5-9C.5 8.2 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C20 5 22.5 8.2 21.5 12 19 16.4 12 21 12 21z"
                    fill="currentColor" />
            </svg>
        </button>
    </div>
);

export default SwipeButtons;
