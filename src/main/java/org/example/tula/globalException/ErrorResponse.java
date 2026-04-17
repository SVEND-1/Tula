package org.example.tula.globalException;

import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        String errorMessage,
        LocalDateTime errorTime
) {
}
