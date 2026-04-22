import React from 'react';

// Декоративный фон — floating-shape, сердечки и лапки
const BackgroundAnimation: React.FC = () => (
    <div className="bg-animation">
        {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={`floating-shape shape-${i + 1}`} />
        ))}
        {Array.from({ length: 15 }, (_, i) => (
            <div key={`heart-${i}`} className="heart">❤️</div>
        ))}
        {Array.from({ length: 15 }, (_, i) => (
            <div key={`paw-${i}`} className="paw">🐾</div>
        ))}
    </div>
);

export default BackgroundAnimation;
