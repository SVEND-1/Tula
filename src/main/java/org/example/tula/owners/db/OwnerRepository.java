package org.example.tula.owners.db;

import org.springframework.data.jpa.repository.JpaRepository;


public interface OwnerRepository extends JpaRepository<OwnerEntity, Long> {

    OwnerEntity findByOwnerId(Long ownerId);
}
