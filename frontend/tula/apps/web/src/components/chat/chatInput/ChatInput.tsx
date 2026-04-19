import React, { useRef } from 'react';
import styles from './ChatInput.module.css';

interface Props {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;
    onSend(text);
    if (inputRef.current) inputRef.current.value = '';
  };

  // Enter отправляет, Shift+Enter — перенос строки
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.footer}>


      <div className={styles.inputWrap}>
        <textarea
          ref={inputRef}
          className={styles.input}
          rows={1}
          placeholder="Написать сообщение..."
          onKeyDown={handleKeyDown}
        />
      </div>

      <button className={styles.sendBtn} onClick={handleSend} aria-label="Отправить">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
