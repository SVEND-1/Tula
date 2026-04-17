package org.example.tula.users.domain.mapper;

import org.example.tula.users.api.dto.users.request.UserCreateRequest;
import org.example.tula.users.api.dto.users.response.UserDefaultResponse;
import org.example.tula.users.api.dto.users.response.UserRegistrationResponse;
import org.example.tula.users.db.UserEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserRegistrationResponse convertEntityToDto(UserEntity user);

    UserCreateRequest convertDtoToCreateRequest(UserEntity user);

    UserEntity convertDtoToEntity(UserRegistrationResponse userRegistrationResponse);

    UserDefaultResponse convertEntityToUserDefaultResponse(UserEntity userEntity);

    List<UserDefaultResponse> convertEntitiesToUserDefaultResponses(List<UserEntity> userEntityList);
}
