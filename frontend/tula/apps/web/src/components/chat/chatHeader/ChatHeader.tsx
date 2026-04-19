import React from 'react';
import type {PetChat} from '../../../types/chat/chat.types.ts';
import styles from './ChatHeader.module.css';
import photoIcon from '../../../assets/chat/photo.svg'
import infoIcon from '../../../assets/chat/info.svg'

interface Props {
  pet: PetChat;
  onBack: () => void; // кнопка "назад" — нужна только на мобильном
}

const ChatHeader: React.FC<Props> = ({ pet, onBack }) => (
  <div className={styles.header}>
    {/* Кнопка назад — видна только на мобильном через CSS */}
    <button className={styles.backBtn} onClick={onBack} aria-label="Назад">
      ←
    </button>

    <div className={styles.avatar}>{pet.emoji}</div>

    <div className={styles.info}>
      <span className={styles.name}>{pet.name} - {pet.breed}</span>
    </div>

    <div className={styles.actions}>
        <button className={styles.iconBtn} title="Фото">
            <img src={photoIcon} alt="фото" style={{ width: '100%', height: '100%' }} />
        </button>

        <button className={styles.iconBtn} title="Информация">
            <img src={infoIcon} alt="инфо" style={{ width: '100%', height: '100%' }} />
        </button>


    </div>
  </div>
);

export default ChatHeader;
