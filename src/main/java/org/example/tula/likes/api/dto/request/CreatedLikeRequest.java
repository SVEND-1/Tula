package org.example.tula.likes.api.dto.request;

import org.example.tula.likes.db.StatusLike;

public record CreatedLikeRequest(
        StatusLike status,
        Long animalId
) {
}
