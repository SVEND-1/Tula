package org.example.tula.animals.domain.mapper;

import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.db.AnimalEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AnimalMapper {

    Animal convertEntityToDTO(AnimalEntity entity);

    List<Animal> convertEntityListToDTO(List<AnimalEntity> entityList);
}
