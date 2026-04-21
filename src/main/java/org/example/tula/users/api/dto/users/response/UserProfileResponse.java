package org.example.tula.users.api.dto.users.response;

import org.example.tula.animals.api.dto.Animal;
import org.example.tula.reviews.api.dto.Review;

import java.util.List;

public record UserProfileResponse(
        String name,
        String email,
        List<Animal> likeAnimals,
        List<Animal> myAnimals,
        List<Review> myReview
) {
}
