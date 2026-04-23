package org.example.tula.follow.api.dto;

import org.example.tula.owners.api.dto.Owner;
import org.example.tula.users.api.dto.users.User;

import java.time.LocalDateTime;

public record Follow(
        Owner owner,
        User user,
        LocalDateTime createAt
) {
}
