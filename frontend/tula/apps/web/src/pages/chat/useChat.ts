import { useState, useCallback, useEffect } from 'react';
import type { PetChat, Message } from '../../types/chat/chat.types.ts';
import { getChats, getMessages, sendMessageApi } from '../../api/chatApi';

// формат времени
const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const useChat = () => {
    const [chats, setChats] = useState<PetChat[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);


    const activeChat = chats.find(c => c.id === activeChatId) ?? null;

    // 🔹 загрузка чатов
    useEffect(() => {
        const loadChats = async () => {
            try {
                const res = await getChats();

                const mapped: PetChat[] = res.data.map((chat: any) => ({
                    id: chat.id,
                    name: chat.animal.name,
                    breed: chat.animal.breed,
                    emoji: '🐾',
                    preview: '',
                    time: '',
                    unread: 0,
                    messages: [],
                }));

                setChats(mapped);
            } catch (e) {
                console.error('Ошибка загрузки чатов', e);
            }
        };

        loadChats();
    }, []);

    // 🔹 открыть чат и загрузить сообщения
    const selectChat = useCallback(async (id: number) => {
        setActiveChatId(id);

        try {
            const res = await getMessages(id);

            const messages: Message[] = res.data.map((m: any) => ({
                id: String(m.id),

                // 🔥 ВАЖНО: правильная логика BUYER / SELLER
                from: m.senderType === 'BUYER' ? 'out' : 'in',

                text: m.message,
                time: formatTime(m.createdAt),
            }));

            setChats(prev =>
                prev.map(c =>
                    c.id === id ? { ...c, messages } : c
                )
            );
        } catch (e) {
            console.error('Ошибка загрузки сообщений', e);
        }
    }, []);

    const closeChat = useCallback(() => {
        setActiveChatId(null);
    }, []);

    // 🔹 отправка сообщения
    const sendMessage = useCallback(async (text: string) => {
        if (!activeChatId) return;

        try {
            const res = await sendMessageApi(activeChatId, text);

            const newMsg: Message = {
                id: String(res.data.id),
                from: 'out',
                text: res.data.message,
                time: formatTime(res.data.createdAt),
            };

            setChats(prev =>
                prev.map(c =>
                    c.id === activeChatId
                        ? {
                            ...c,
                            messages: [...c.messages, newMsg],
                            preview: newMsg.text,
                            time: newMsg.time,
                        }
                        : c
                )
            );
        } catch (e) {
            console.error('Ошибка отправки сообщения', e);
        }
    }, [activeChatId]);

    // 🔁 polling сообщений
    useEffect(() => {
        if (!activeChatId) return;

        const interval = setInterval(async () => {
            try {
                const res = await getMessages(activeChatId);

                const messages: Message[] = res.data.map((m: any) => ({
                    id: String(m.id),
                    from: m.senderType === 'BUYER' ? 'out' : 'in',
                    text: m.message,
                    time: formatTime(m.createdAt),
                }));

                setChats(prev =>
                    prev.map(c =>
                        c.id === activeChatId
                            ? { ...c, messages }
                            : c
                    )
                );
            } catch (e) {
                console.error('Polling error', e);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeChatId]);

    return {
        chats,
        activeChat,
        activeChatId,

        selectChat,
        closeChat,
        sendMessage,
    };
};