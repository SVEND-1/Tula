import React from 'react';
import styles from './EmptyChat.module.css';

import pawIcon from '../../../assets/paw.svg'

// Заглушка когда ни один чат не выбран (видна только на десктопе)
const EmptyChat: React.FC = () => (
    <div className={styles.empty}><img src={pawIcon} alt="paw" className={styles.icon} />
    <p className={styles.title}>Выберите чат</p>
    <p className={styles.sub}>Свайпните питомца вправо, чтобы начать общение</p>
  </div>
);

export default EmptyChat;
