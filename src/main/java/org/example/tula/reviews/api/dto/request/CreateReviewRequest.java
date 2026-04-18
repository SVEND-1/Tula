package org.example.tula.reviews.api.dto.request;

public record CreateReviewRequest(
        String content,
        Long ownerId
) {
}
