import React from 'react';

// Подсказка со стрелкой — показывается первые 8 секунд
const SwipeHint: React.FC = () => (
    <div className="hint">
        <div className="hint-text">Выбери своего питомца</div>
        <svg className="arrow" viewBox="0 0 300 200">
            <defs>
                <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                    <path d="M0,0 L10,5 L0,10 Z" fill="#333" />
                </marker>
            </defs>
            <path
                className="arrow-path"
                d="M 20 120 C 60 20, 160 20, 160 90 C 160 160, 220 160, 260 110"
                markerEnd="url(#arrowHead)"
            />
        </svg>
    </div>
);

export default SwipeHint;
