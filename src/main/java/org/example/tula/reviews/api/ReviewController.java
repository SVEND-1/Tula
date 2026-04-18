package org.example.tula.reviews.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.reviews.api.dto.Review;
import org.example.tula.reviews.api.dto.request.CreateReviewRequest;
import org.example.tula.reviews.domain.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reviewService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }
}
