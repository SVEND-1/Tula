package org.example.tula.owners.api.dto.response;

import org.example.tula.animals.api.dto.Animal;
import org.example.tula.reviews.api.dto.Review;

import java.util.List;

public record OwnerProfileResponse(
        String ownerName,
        List<Animal> animals,
        List<Review> reviews
) {
}
