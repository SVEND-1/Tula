package org.example.tula.reviews.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.owners.domain.OwnerService;
import org.example.tula.reviews.api.dto.Review;
import org.example.tula.reviews.api.dto.request.CreateReviewRequest;
import org.example.tula.reviews.db.ReviewEntity;
import org.example.tula.reviews.db.ReviewRepository;
import org.example.tula.reviews.domain.mapper.ReviewMapper;
import org.example.tula.users.domain.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final ReviewMapper reviewMapper;
    private final OwnerService ownerService;

    public Review findById(Long id) {
        return reviewMapper.convertEntityToDTO(
                findByIdEntity(id)
        );
    }

    public ReviewEntity findByIdEntity(Long id) {
        return reviewRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));

    }

    public List<Review> findAllByReviewBy(Long id) {
        return reviewMapper.convertEntityListToDTO(
                reviewRepository.findAllByReviewedById(id)
        );
    }

    public Review createReview(CreateReviewRequest request) {
       try {
           return reviewMapper.convertEntityToDTO(reviewRepository.save(
                   ReviewEntity.builder()
                           .content(request.content())
                           .reviewer(userService.getCurrentUser())
                           .reviewedBy(ownerService.findByIdEntity(request.ownerId()))
                           .createdAt(LocalDateTime.now())
                           .build()
           ));
       }catch (Exception e) {
           log.error("Не удалось добавить отзыв,ex={}",e.getMessage());
           throw new RuntimeException(e);
       }
    }
}
