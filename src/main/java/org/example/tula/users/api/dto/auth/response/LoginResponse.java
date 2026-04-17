package org.example.tula.users.api.dto.auth.response;

public record LoginResponse(
        boolean success,
        String message) {
}
