import { useState, useCallback, useEffect } from 'react';
import { getAllChats, getMessages, sendMessage, createChat } from '../../api/chatApi';
import type { ChatMessageResponse } from '../../api/chatApi';
import type { PetChat, Message } from '../../types/chat/chat.types';
import { useSound } from '../../hooks/useSound';

const getTimeFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const useChat = () => {
    const [chats, setChats] = useState<PetChat[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { playMessageSound } = useSound();

    // Загрузка всех чатов
    const loadChats = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllChats();
            const chatData = response.data;

            const formattedChats: PetChat[] = chatData.map(chat => ({
                id: chat.id,
                name: chat.animal.name,
                breed: chat.animal.breed,
                emoji: chat.animal.animalType === 'DOG' ? '🐕' : '🐈',
                preview: 'Новое сообщение',
                time: formatDate(chat.updatedAt),
                unread: 0,
                messages: [],
                animalId: chat.animal.id,
                sellerId: chat.seller.id,
                buyerId: chat.buyer.id
            }));

            setChats(formattedChats);

            // Загружаем последние сообщения для каждого чата
            for (const chat of formattedChats) {
                try {
                    const lastMsgResponse = await getMessages(chat.id, 1, 0);
                    if (lastMsgResponse.data && lastMsgResponse.data.length > 0) {
                        const lastMsg = lastMsgResponse.data[0];
                        chat.preview = lastMsg.message;
                        chat.time = formatDate(lastMsg.createdAt);
                    }
                } catch (e) {
                    console.error('Ошибка загрузки последнего сообщения:', e);
                }
            }

            setChats([...formattedChats]);
        } catch (error) {
            console.error('Ошибка загрузки чатов:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    // Загрузка сообщений выбранного чата
    const loadMessages = useCallback(async (chatId: number) => {
        try {
            const response = await getMessages(chatId);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const currentUserId = user.id;

            const messages: Message[] = (response.data || []).map((msg: ChatMessageResponse) => {
                // Проверяем, что fromUser существует
                const fromUserId = msg.fromUser?.id;
                return {
                    id: msg.id,
                    from: fromUserId === currentUserId ? 'out' : 'in',
                    text: msg.message,
                    time: formatDate(msg.createdAt)
                };
            });

            setChats(prev => prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, messages, unread: 0 }
                    : chat
            ));
        } catch (error) {
            console.error('Ошибка загрузки сообщений:', error);
        }
    }, []);

    // Создание нового чата
    const createNewChat = useCallback(async (animalId: number) => {
        try {
            const response = await createChat(animalId);
            const newChat = response.data;

            const formattedChat: PetChat = {
                id: newChat.id,
                name: newChat.animal.name,
                breed: newChat.animal.breed,
                emoji: newChat.animal.animalType === 'DOG' ? '🐕' : '🐈',
                preview: 'Новый чат',
                time: formatDate(newChat.createdAt),
                unread: 0,
                messages: [],
                animalId: newChat.animal.id,
                sellerId: newChat.seller.id,
                buyerId: newChat.buyer.id
            };

            setChats(prev => [formattedChat, ...prev]);
            setActiveChatId(newChat.id);
            return newChat.id;
        } catch (error) {
            console.error('Ошибка создания чата:', error);
            throw error;
        }
    }, []);

    const selectChat = useCallback(async (id: number) => {
        setActiveChatId(id);
        await loadMessages(id);
    }, [loadMessages]);

    const closeChat = useCallback(() => setActiveChatId(null), []);

    const sendMessageToChat = useCallback(async (text: string) => {
        playMessageSound();
        if (!activeChatId) return;

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userMsg: Message = {
            id: Date.now(),
            from: 'out',
            text,
            time: getTimeFromDate(new Date().toISOString())
        };

        // Оптимистичное обновление
        setChats(prev =>
            prev.map(chat =>
                chat.id === activeChatId
                    ? { ...chat, messages: [...chat.messages, userMsg], preview: text, time: getTimeFromDate(new Date().toISOString()) }
                    : chat
            )
        );

        try {
            const response = await sendMessage(activeChatId, text);
            const savedMsg = response.data;

            const fromUserId = savedMsg.fromUser?.id;
            const serverMsg: Message = {
                id: savedMsg.id,
                from: fromUserId === user.id ? 'out' : 'in',
                text: savedMsg.message,
                time: formatDate(savedMsg.createdAt)
            };

            // Заменяем оптимистичное сообщение на серверное
            setChats(prev =>
                prev.map(chat =>
                    chat.id === activeChatId
                        ? {
                            ...chat,
                            messages: [...chat.messages.slice(0, -1), serverMsg],
                            preview: text,
                            time: formatDate(savedMsg.createdAt)
                        }
                        : chat
                )
            );
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            alert('Не удалось отправить сообщение');
            // Удаляем оптимистичное сообщение при ошибке
            setChats(prev =>
                prev.map(chat =>
                    chat.id === activeChatId
                        ? { ...chat, messages: chat.messages.slice(0, -1) }
                        : chat
                )
            );
        }
    }, [activeChatId]);

    const activeChat = chats.find(c => c.id === activeChatId) ?? null;

    return {
        chats,
        activeChat,
        activeChatId,
        isLoading,
        selectChat,
        closeChat,
        sendMessage: sendMessageToChat,
        createNewChat,
        loadChats
    };
};