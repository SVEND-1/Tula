import React, { useState } from 'react';
import AppHeader from '../../components/chat/appHeader/AppHeader.tsx';
import ChatSidebar from '../../components/chat/chatSidebar/ChatSidebar.tsx';
import ChatWindow from '../../components/chat/chatWindow/ChatWindow.tsx';
import EmptyChat from '../../components/chat/emptyChat/EmptyChat.tsx';
import { useChat } from './useChat';
import styles from './Chat.module.css';

const Chat: React.FC = () => {
    const { chats, activeChat, activeChatId,  isLoading, selectChat, closeChat, sendMessage } = useChat();
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

    const handleSelectChat = (id: number) => {
        selectChat(id);
        setMobileView('chat');
    };

    const handleBack = () => {
        closeChat();
        setMobileView('list');
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <AppHeader />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <p>Загрузка чатов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <AppHeader />

            <div className={styles.layout}>
                <div className={`${styles.sidebarWrap} ${mobileView === 'chat' ? styles.hideMobile : ''}`}>
                    <ChatSidebar
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={handleSelectChat}
                    />
                </div>

                <div className={`${styles.mainWrap} ${mobileView === 'list' ? styles.hideMobile : ''}`}>
                    {activeChat ? (
                        <ChatWindow
                            pet={activeChat}
                            isTyping={false}
                            onSend={sendMessage}
                            onBack={handleBack}
                        />
                    ) : (
                        <EmptyChat />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;