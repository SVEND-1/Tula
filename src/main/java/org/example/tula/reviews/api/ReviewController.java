package org.example.tula.reviews.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.tula.reviews.api.dto.Review;
import org.example.tula.reviews.api.dto.request.CreateReviewRequest;
import org.example.tula.reviews.domain.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Review", description = "Управление Отзывами")
public class ReviewController {
    private final ReviewService reviewService;

    @Operation(summary = "Получение отзыва")
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reviewService.findById(id));
    }

    @Operation(summary = "Получение всех отзывов в приюте")
    @GetMapping("/owner/{id}")
    public ResponseEntity<List<Review>> getReviewsByOwnerId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reviewService.findAllByReviewBy(id));
    }

    @Operation(summary = "Добавление отзыва приюту")
    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }
}
