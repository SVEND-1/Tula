package org.example.tula.animals.api.dto;

import org.example.tula.animals.db.AnimalType;
import org.example.tula.animals.db.Gender;
import org.example.tula.animals.db.StatusAnimal;

import java.time.LocalDateTime;

public record Animal(
        String name,
        Integer age,
        String description,
        String breed,
        Gender gender,
        AnimalType animalType,
        StatusAnimal status,
        Long personTakeId,
        LocalDateTime createAt
) {
}
