package org.example.tula.animals.api.dto.request;

public record AnimalUpdateRequest(
        String name,
        String description,
        Integer age
) {
}
