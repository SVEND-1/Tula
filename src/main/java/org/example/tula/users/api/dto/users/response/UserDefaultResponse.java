package org.example.tula.users.api.dto.users.response;

import org.example.tula.users.db.Role;

public record UserDefaultResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}
