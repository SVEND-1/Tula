package org.example.tula.chats.domain.mappers;

import org.example.tula.chats.api.dto.responses.ChatResponse;
import org.example.tula.chats.db.entities.ChatEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChatMapper {
    ChatResponse convertEntityToResponse(ChatEntity entity);
    List<ChatResponse> convertEntityListToResponseList(List<ChatEntity> entity);

    ChatEntity convertResponseToEntity(ChatResponse response);
    List<ChatEntity> convertResponseListToEntityList(List<ChatResponse> response);
}
