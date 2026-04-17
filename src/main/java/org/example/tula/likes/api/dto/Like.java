package org.example.tula.likes.api.dto;

import org.example.tula.likes.db.StatusLike;

import java.time.LocalDateTime;

public record Like(
    StatusLike status,
    Long userId,
    Long animalId,
    LocalDateTime createdAt
) {
}
