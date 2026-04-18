package org.example.tula.likes.domain.mapper;

import org.example.tula.likes.api.dto.Like;
import org.example.tula.likes.db.LikeEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LikeMapper {
    Like convertEntityToDTO(LikeEntity entity);

    List<Like> convertEntityListToDTO(List<LikeEntity> entity);
}
