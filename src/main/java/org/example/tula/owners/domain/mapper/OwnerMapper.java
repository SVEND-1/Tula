package org.example.tula.owners.domain.mapper;

import org.example.tula.owners.api.dto.Owner;
import org.example.tula.owners.db.OwnerEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OwnerMapper {
    Owner convertEntityToDTO(OwnerEntity entity);
    List<Owner> convertEntityListToDTO(List<OwnerEntity> entityList);
}
