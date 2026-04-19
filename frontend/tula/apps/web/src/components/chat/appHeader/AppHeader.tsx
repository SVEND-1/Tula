import React from 'react';
import styles from './AppHeader.module.css';

const AppHeader: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <div className={styles.logoPaw}>🐾</div>
      Adoptly
    </div>
    <button className={styles.profileBtn}>
      <div className={styles.profileAvatar}>А</div>
      Профиль
    </button>
  </header>
);

export default AppHeader;
