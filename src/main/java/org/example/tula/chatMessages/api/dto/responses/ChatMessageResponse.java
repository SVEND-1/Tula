package org.example.tula.chatMessages.api.dto.responses;

import org.example.tula.chatMessages.db.enums.SenderType;
import org.example.tula.chats.api.dto.responses.ChatResponse;
import org.example.tula.users.api.dto.users.response.UserDefaultResponse;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long id,
        ChatResponse chat,
        UserDefaultResponse sender,
        SenderType senderType,
        String message,
        LocalDateTime createdAt
) {
}
