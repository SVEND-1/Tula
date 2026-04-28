package org.example.tula.videos.api.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record VideoResponse(
        Long id,
        String title,
        String description,
        String filePath,
        LocalDateTime createdAt,
        String uploaderName,
        int likesCount,
        List<CommentResponse> comments
) {}