package org.example.tula.animals.api.dto;

import org.example.tula.animals.db.AnimalType;
import org.example.tula.animals.db.Gender;
import org.example.tula.animals.db.StatusAnimal;

public record Animal(
        String name,
        int age,
        String description,
        String breed,
        Gender gender,
        AnimalType animalType,
        StatusAnimal status,
        Long personTakeId
) {
}
