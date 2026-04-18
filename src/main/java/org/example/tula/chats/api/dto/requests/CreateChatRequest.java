package org.example.tula.chats.api.dto.requests;

public record CreateChatRequest(
    Long animalId,
    Long sellerId,
    Long buyerId
) {
}
