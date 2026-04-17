package org.example.tula.likes.api.dto.response;

public record TakeResponse(
        String result,
        String ownerEmail,
        String animalName
) {
}
