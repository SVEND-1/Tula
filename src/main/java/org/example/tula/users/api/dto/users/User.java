package org.example.tula.users.api.dto.users;

import org.example.tula.users.db.Role;

public record User(
        Long id,
        String name,
        String email,
        Role role
) {
}
