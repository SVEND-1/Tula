import React from 'react';

interface Props {
    navigate: (path: string) => void;
}

const AnimalHeader: React.FC<Props> = ({ navigate }) => (
    <header className="animal-header">
        <button onClick={() => navigate('/main')} className="back-btn">
            ← Назад
        </button>
        <div className="logo">Adoptly</div>
        <div className="profile" onClick={() => navigate('/liked')}>
            Профиль
        </div>
    </header>
);

export default AnimalHeader;