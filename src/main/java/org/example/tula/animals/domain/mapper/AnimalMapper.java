package org.example.tula.animals.domain.mapper;

import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.response.AnimalProfileResponse;
import org.example.tula.animals.db.AnimalEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AnimalMapper {

    Animal convertEntityToDTO(AnimalEntity entity);

    List<Animal> convertEntityListToDTO(List<AnimalEntity> entityList);

    @Mapping(source = "owner.name", target = "ownerName")
    @Mapping(source = "owner.id", target = "ownerId")
    AnimalProfileResponse convertEntityToProfile(AnimalEntity animal);
}
