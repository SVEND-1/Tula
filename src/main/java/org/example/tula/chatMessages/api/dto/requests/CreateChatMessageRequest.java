package org.example.tula.chatMessages.api.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record CreateChatMessageRequest(
        @NotBlank(message = "Message shouldn't be blank")
        String message
) {
}
