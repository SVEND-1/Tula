package org.example.tula.users.api.dto.auth.response;

public record SimpleResponse(
        boolean success,
        String message
) {
}
