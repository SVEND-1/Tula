package org.example.tula.animals.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.response.AnimalImageResponse;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.db.AnimalRepository;
import org.example.tula.animals.domain.exceptions.AnimalImageException;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.minio.services.MinioService;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnimalImageService {
    @Value("${minio.buckets.pets-images}")
    private String MODULE_KEY;

    private final MinioService minioService;
    private final UserService userService;
    private final AnimalRepository animalRepository;
    private final AnimalMapper animalMapper;

    //====================================CONTROLLER METHODS=======================================================

    public AnimalImageResponse uploadImageById(Long animalId, MultipartFile file) {
        log.info("Uploading image {} to Minio", file.getOriginalFilename());
        AnimalEntity animalEntity = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal with id: " + animalId + " not found"));

        checkIsFormOwner(animalEntity);

        deleteIfHasImage(animalEntity);

        String objectPath = minioService.uploadFile(MODULE_KEY, file);
        animalEntity.setImagePath(objectPath);

        AnimalEntity savedEntity = animalRepository.save(animalEntity);
        log.info("Avatar for animal {} uploaded: {}", animalId, objectPath);
        return animalMapper.convertImageEntityToResponse(savedEntity);
    }

    public String getAnimalImageUrl(Long animalId) {
        log.info("Getting animal image url for animal form with id: {}", animalId);
        AnimalEntity animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + animalId));

        String avatarPath = checkHasImage(animal);

        return minioService.generatePresignedUrl(MODULE_KEY, avatarPath);
    }

    public void deleteAnimalImage(Long animalId) {
        log.info("Deleting animal image for animal with id: {}", animalId);
        AnimalEntity animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + animalId));

        checkIsFormOwner(animal);

        String avatarPath = checkHasImage(animal);

        minioService.deleteFile(MODULE_KEY, avatarPath);
        animal.setImagePath(null);
        animalRepository.save(animal);
        log.info("Avatar for animal {} deleted", animalId);
    }

    //====================================SERVICE METHODS=======================================================

    private void deleteIfHasImage(AnimalEntity animalEntity) {
        String oldPath = animalEntity.getImagePath();
        if (oldPath != null) {
            minioService.deleteFile(MODULE_KEY, oldPath);
        }
    }

    private String checkHasImage(AnimalEntity animalEntity) {
        String avatarPath = animalEntity.getImagePath();
        if (avatarPath == null) {
            throw new AnimalImageException("This form haven't image");
        }

        return avatarPath;
    }

    private void checkIsFormOwner(AnimalEntity animalEntity) {
        UserEntity currentUser = userService.getCurrentUser();

        if (!animalEntity.getOwner().getOwner().getId().equals(currentUser.getId())) {
            throw new AnimalImageException("You are not the owner of this animal form");
        }
    }

    //====================================METHODS FOR OTHER SERVICES=======================================================

    public String uploadImageForNewForm(MultipartFile file) {
        log.info("New avatar for animal");
        if (file.isEmpty()) {
            return null;
        }

        return minioService.uploadFile(MODULE_KEY, file);
    }
}

