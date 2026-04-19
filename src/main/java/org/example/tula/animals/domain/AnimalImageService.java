package org.example.tula.animals.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.db.AnimalRepository;
import org.example.tula.minio.services.MinioService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnimalImageService {
    private static final String MODULE_KEY = "pets-images";
    private static final int URL_EXPIRY_SECONDS = 3600;

    private final MinioService minioService;
    private final AnimalRepository animalRepository;

    public String uploadImage(Long animalId, MultipartFile file) {
        AnimalEntity animalEntity = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal with id: " + animalId + " not found"));

        String oldPath = animalEntity.getImagePath();
        if (oldPath != null) {
            minioService.deleteFile(MODULE_KEY, oldPath);
        }

        String objectPath = minioService.uploadFile(MODULE_KEY, file);
        animalEntity.setImagePath(objectPath);
        animalRepository.save(animalEntity);

        log.info("Avatar for animal {} uploaded: {}", animalId, objectPath);
        return objectPath;
    }

    public String getAnimalImageUrl(Long animalId) {
        AnimalEntity animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + animalId));

        String avatarPath = animal.getImagePath();
        if (avatarPath == null) {
            return null;
        }

        return minioService.generatePresignedUrl(MODULE_KEY, avatarPath, URL_EXPIRY_SECONDS);
    }

    public void deleteAnimalImage(Long animalId) {
        AnimalEntity animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + animalId));

        String avatarPath = animal.getImagePath();
        if (avatarPath != null) {
            minioService.deleteFile(MODULE_KEY, avatarPath);
            animal.setImagePath(null);
            animalRepository.save(animal);
            log.info("Avatar for animal {} deleted", animalId);
        }
    }
}

