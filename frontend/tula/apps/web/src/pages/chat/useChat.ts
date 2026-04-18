import { useState, useCallback } from 'react';
import type { PetChat, Message } from '../../types/chat/chat.types.ts';
import { MOCK_CHATS } from '../../api/mockData';

// Заготовки ответов питомца — потом заменить на реальный API
const PET_REPLIES = [
  'Гав! Это звучит здорово! 🐾',
  'Мур... интересно. Расскажи ещё.',
  'Ура!! Ты лучший! 🎉',
  'Хвостик виляет от радости! 🐕',
  'Ты точно мой человек! 💕',
];

const getTime = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const useChat = () => {
  const [chats, setChats] = useState<PetChat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  // Открыть чат — сбросить счётчик непрочитанных
  const selectChat = useCallback((id: number) => {
    setActiveChatId(id);
    setChats(prev =>
      prev.map(c => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  const closeChat = useCallback(() => setActiveChatId(null), []);

  // Отправить сообщение + симулировать ответ питомца
  const sendMessage = useCallback((text: string) => {
    if (!activeChatId) return;

    const userMsg: Message = {
      id: `${Date.now()}-out`,
      from: 'out',
      text,
      time: getTime(),
    };

    // Добавляем сообщение пользователя и обновляем превью
    setChats(prev =>
      prev.map(c =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, userMsg], preview: text, time: getTime() }
          : c
      )
    );

    // Питомец "печатает" ~1.4 секунды, потом отвечает
    setIsTyping(true);
    setTimeout(() => {
      const reply = PET_REPLIES[Math.floor(Math.random() * PET_REPLIES.length)];
      const petMsg: Message = {
        id: `${Date.now()}-in`,
        from: 'in',
        text: reply,
        time: getTime(),
      };

      setChats(prev =>
        prev.map(c =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, petMsg], preview: reply, time: getTime() }
            : c
        )
      );
      setIsTyping(false);
    }, 1400);
  }, [activeChatId]);

  return { chats, activeChat, activeChatId, isTyping, selectChat, closeChat, sendMessage };
};
