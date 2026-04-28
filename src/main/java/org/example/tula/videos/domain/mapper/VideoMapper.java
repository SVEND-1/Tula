package org.example.tula.videos.domain.mapper;

import org.example.tula.videos.api.dto.response.CommentResponse;
import org.example.tula.videos.api.dto.response.VideoResponse;
import org.example.tula.videos.db.comment.VideoCommentEntity;
import org.example.tula.videos.db.video.VideoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface VideoMapper {

    @Mapping(source = "user.name", target = "uploaderName")
    @Mapping(target = "likesCount", expression = "java(getLikesCount(entity))")
    @Mapping(target = "comments", expression = "java(getCommentsList(entity))")
    VideoResponse convertEntityToDto(VideoEntity entity);

    List<VideoResponse> convertEntityListToDto(List<VideoEntity> entities);

    @Mapping(source = "user.name", target = "authorName")
    CommentResponse convertCommentToDto(VideoCommentEntity comment);

    default int getLikesCount(VideoEntity entity) {
        return entity.getLikes() != null ? entity.getLikes().size() : 0;
    }

    default List<CommentResponse> getCommentsList(VideoEntity entity) {
        if (entity.getComments() == null || entity.getComments().isEmpty()) {
            return Collections.emptyList();
        }
        return entity.getComments().stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());
    }
}