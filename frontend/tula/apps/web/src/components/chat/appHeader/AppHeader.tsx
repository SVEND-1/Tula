import React from 'react';
import { useNavigate } from 'react-router-dom';
// import styles from './AppHeader.module.css';

const AppHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="adopt-header"
                style={{borderBottom: "1.5px solid rgba(255, 184, 140, 0.4)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    background: "rgba(255, 235, 220, 0.67)"}}>

            <div className="logo">Adoptly</div>
            <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
        </header>
    );
};

export default AppHeader;