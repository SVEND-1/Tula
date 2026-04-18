package org.example.tula.animals.api.dto.response;

import org.example.tula.animals.db.AnimalType;
import org.example.tula.animals.db.Gender;

import java.time.LocalDateTime;

public record AnimalProfileResponse(
        String name,
        Integer age,
        String description,
        String breed,
        Gender gender,
        AnimalType animalType,
        String ownerName,
        LocalDateTime createAt

) {
}
