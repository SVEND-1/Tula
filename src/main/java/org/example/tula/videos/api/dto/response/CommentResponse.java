package org.example.tula.videos.api.dto.response;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String text,
        String authorName,
        LocalDateTime createdAt
) {}
