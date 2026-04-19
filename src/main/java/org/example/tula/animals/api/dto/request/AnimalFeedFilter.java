package org.example.tula.animals.api.dto.request;

import org.example.tula.animals.db.AnimalType;
import org.example.tula.animals.db.Gender;

public record AnimalFeedFilter(
        Integer age,
        String breed,
        Gender gender,
        AnimalType animalType,
        Integer size,
        Integer page
) {
}
