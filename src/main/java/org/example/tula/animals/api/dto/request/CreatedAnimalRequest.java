package org.example.tula.animals.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.example.tula.animals.db.AnimalType;
import org.example.tula.animals.db.Gender;

public record CreatedAnimalRequest(
        @NotBlank
        String name,

        @Positive
        Integer age,

        String description,

        @NotBlank
        String breed,

        @NotNull
        Gender gender,

        @NotNull
        AnimalType animalType
) {
}
