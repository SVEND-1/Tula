package org.example.tula.chatMessages.db.entities;

import jakarta.persistence.*;
import lombok.*;
import org.example.tula.chatMessages.db.enums.SenderType;
import org.example.tula.chats.db.entities.ChatEntity;
import org.example.tula.users.db.UserEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private ChatEntity chat;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private UserEntity sender;

    @Column(name = "sender_type")
    @Enumerated(EnumType.STRING)
    private SenderType senderType;

    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
