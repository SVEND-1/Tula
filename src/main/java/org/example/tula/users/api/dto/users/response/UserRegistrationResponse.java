package org.example.tula.users.api.dto.users.response;


import org.example.tula.users.db.Role;

public record UserRegistrationResponse(
        Long id,
        String name,
        String email,
        String password,
        Role role
) {
}
