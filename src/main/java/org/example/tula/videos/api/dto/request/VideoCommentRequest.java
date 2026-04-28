package org.example.tula.videos.api.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

public record VideoCommentRequest(
        @NotNull
        @Max(1000)
        String text
) {}
