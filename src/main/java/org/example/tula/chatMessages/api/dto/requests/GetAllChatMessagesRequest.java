package org.example.tula.chatMessages.api.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record GetAllChatMessagesRequest(
        @NotBlank
        Long chatId,
        Integer pageSize,
        Integer pageNum
) {
}
