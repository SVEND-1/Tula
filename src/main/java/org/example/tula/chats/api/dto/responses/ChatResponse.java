package org.example.tula.chats.api.dto.responses;

import org.example.tula.animals.api.dto.response.AnimalResponseForChat;
import org.example.tula.users.api.dto.users.response.UserDefaultResponse;

import java.time.LocalDateTime;

public record ChatResponse(
        Long id,
        UserDefaultResponse seller,
        UserDefaultResponse buyer,
        AnimalResponseForChat animal,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
