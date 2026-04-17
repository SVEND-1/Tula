package org.example.tula.users.api.dto.auth.response;

public record RegistrationResponse(
        boolean success,
        String message,
        String registrationId
) {
}
