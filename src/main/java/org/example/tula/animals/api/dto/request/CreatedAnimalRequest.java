package org.example.tula.animals.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.example.tula.animals.db.AnimalType;
import org.example.tula.animals.db.Gender;

public record CreatedAnimalRequest(
        @NotBlank
        String name,

        @Min(0)
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
