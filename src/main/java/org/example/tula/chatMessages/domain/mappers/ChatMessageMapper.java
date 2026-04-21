package org.example.tula.chatMessages.domain.mappers;

import org.example.tula.chatMessages.api.dto.responses.ChatMessageResponse;
import org.example.tula.chatMessages.db.entities.ChatMessageEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChatMessageMapper {
    ChatMessageResponse convertEntityToResponse(ChatMessageEntity entity);
    ChatMessageEntity convertResponseToEntity(ChatMessageResponse response);

    List<ChatMessageResponse> convertEntityListToResponseList(List<ChatMessageEntity> entities);
    List<ChatMessageEntity> convertResponseListToEntityList(List<ChatMessageResponse> responses);

}
