package org.example.tula.chatMessages.db.repositories;

import org.example.tula.chatMessages.db.entities.ChatMessageEntity;
import org.example.tula.chatMessages.db.enums.SenderType;
import org.example.tula.chats.db.entities.ChatEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    @Query("""
            SELECT m FROM ChatMessageEntity m
            WHERE m.chat = :chat
            ORDER BY m.createdAt ASC
            """)
    List<ChatMessageEntity> findAllByChat(
            @Param("chat") ChatEntity chat,
            Pageable pageable);

    @Query("""
            SELECT m FROM ChatMessageEntity m
            WHERE m.chat = :chat
            ORDER BY m.createdAt DESC
            LIMIT 1
            """)
    ChatMessageEntity findLastMessageByChat(
            @Param("chat") ChatEntity chat
    );

    @Query("""
            SELECT m FROM ChatMessageEntity m
            WHERE m.chat = :chat
            AND m.senderType = :senderType
            ORDER BY m.createdAt ASC
            """)
    List<ChatMessageEntity> findAllByChatAndSenderType(
            @Param("chat") ChatEntity chat,
            @Param("senderType") SenderType senderType,
            Pageable pageable
    );
}
