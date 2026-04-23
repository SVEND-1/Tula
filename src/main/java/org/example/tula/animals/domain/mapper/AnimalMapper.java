package org.example.tula.animals.domain.mapper;

import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.response.AnimalImageResponse;
import org.example.tula.animals.api.dto.response.AnimalPageResponse;
import org.example.tula.animals.api.dto.response.AnimalProfileResponse;
import org.example.tula.animals.db.AnimalEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AnimalMapper {

    Animal convertEntityToDTO(AnimalEntity entity);

    List<Animal> convertEntityListToDTO(List<AnimalEntity> entityList);

    @Mapping(source = "owner.ownerName", target = "ownerName")
    @Mapping(source = "owner.id", target = "ownerId")
    AnimalProfileResponse convertEntityToProfile(AnimalEntity animal);

    AnimalImageResponse convertImageEntityToResponse(AnimalEntity entity);

    default AnimalPageResponse toPageResponse(Page<Animal> animalPage) {
        return new AnimalPageResponse(
                animalPage.getContent(),
                animalPage.getNumber(),
                animalPage.getSize(),
                animalPage.getTotalElements(),
                animalPage.getTotalPages(),
                animalPage.isFirst(),
                animalPage.isLast(),
                animalPage.isEmpty()
        );
    }
}
