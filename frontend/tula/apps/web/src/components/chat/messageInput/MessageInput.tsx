import React, { useState, useRef } from 'react';
import styles from './MessageInput.module.css';

interface Props {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    // Сбрасываем высоту textarea после отправки
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  // Авторесайз textarea и отправка по Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Растягиваем поле под контент
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={styles.footer}>
      <button className={styles.attachBtn} title="Прикрепить файл">📎</button>

      <div className={styles.inputWrap}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          placeholder="Написать сообщение..."
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button className={styles.sendBtn} onClick={handleSend} aria-label="Отправить">
        {/* Иконка отправки */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;
