import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.css';

const AppHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <div className={styles.logoPaw}></div>
                Adoptly
            </div>
            <button
                className={styles.profileBtn}
                onClick={() => navigate('/liked')}
            >
                <div className={styles.profileAvatar}>👤</div>
                Профиль
            </button>
        </header>
    );
};

export default AppHeader;