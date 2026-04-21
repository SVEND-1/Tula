package org.example.tula.reviews.db;

import org.example.tula.reviews.api.dto.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity,Long> {

    List<ReviewEntity> findAllByReviewedById(Long reviewedById);
}
