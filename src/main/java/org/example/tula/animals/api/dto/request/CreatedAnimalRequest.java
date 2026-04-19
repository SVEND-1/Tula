package org.example.tula.animals.api.dto.request;

import org.example.tula.animals.db.AnimalType;
import org.example.tula.animals.db.Gender;

public record CreatedAnimalRequest(
    String name,
    Integer age,
    String description,
    String breed,
    Gender gender,
    AnimalType animalType
){
}
