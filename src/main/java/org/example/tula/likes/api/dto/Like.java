package org.example.tula.likes.api.dto;

import org.example.tula.animals.api.dto.Animal;
import org.example.tula.likes.db.StatusLike;
import org.example.tula.users.api.dto.users.User;

import java.time.LocalDateTime;

public record Like(
        Long id,
        StatusLike status,
        User user,
        Animal animal,
        LocalDateTime createdAt
) {
}
