package org.example.tula.users.api.dto.auth.response;

public record PasswordResetResponse(
        boolean success,
        String message,
        String resetId
) {
}
