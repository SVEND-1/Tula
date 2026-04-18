package org.example.tula.reviews.api.dto;

import java.time.LocalDateTime;

public record Review(
        Long id,
        String content,
        LocalDateTime createdAt
) {
}
