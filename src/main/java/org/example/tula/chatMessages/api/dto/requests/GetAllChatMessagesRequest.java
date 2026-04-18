package org.example.tula.chatMessages.api.dto.requests;

import jakarta.validation.constraints.NotNull;

public record GetAllChatMessagesRequest(
        @NotNull
        Long chatId,
        Integer pageSize,
        Integer pageNum
) {
}
