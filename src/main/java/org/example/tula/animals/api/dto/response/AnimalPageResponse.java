package org.example.tula.animals.api.dto.response;

import org.example.tula.animals.api.dto.Animal;

import java.util.List;

public record AnimalPageResponse(
        List<Animal> content,
        int number,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        boolean empty
) {
}
