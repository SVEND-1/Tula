package org.example.tula.reviews.domain.mapper;

import org.example.tula.reviews.api.dto.Review;
import org.example.tula.reviews.db.ReviewEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    Review convertEntityToDTO(ReviewEntity entity);
    List<Review> convertEntityListToDTO(List<ReviewEntity> entityList);
}
