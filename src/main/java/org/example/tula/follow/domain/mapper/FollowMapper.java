package org.example.tula.follow.domain.mapper;

import org.example.tula.follow.api.dto.Follow;
import org.example.tula.follow.db.FollowEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FollowMapper {
    Follow convertEntityToDTO(FollowEntity entity);
}
