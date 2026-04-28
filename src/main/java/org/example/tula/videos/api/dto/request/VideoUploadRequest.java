package org.example.tula.videos.api.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

public record VideoUploadRequest(
        @NotNull
        @Max(255)
        String title,
        @NotNull
        @Max(1000)
        String description
) {}
