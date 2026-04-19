package org.example.tula.animals.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.AnimalFeedFilter;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.api.dto.response.AnimalPageResponse;
import org.example.tula.animals.api.dto.response.AnimalProfileResponse;
import org.example.tula.animals.db.*;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.likes.api.dto.response.TakeResponse;
import org.example.tula.minio.services.MinioService;
import org.example.tula.subscriptions.db.Status;
import org.example.tula.subscriptions.domain.SubscriptionService;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final AnimalMapper animalMapper;
    private final UserService userService;
    private final SubscriptionService subscriptionService;
    private final MinioService minioService;
    @Value("minio.buckets.pets")
    private String bucket;

    public AnimalService(AnimalRepository animalRepository, AnimalMapper animalMapper,
                         @Lazy UserService userService, SubscriptionService subscriptionService, MinioService minioService) {
        this.animalRepository = animalRepository;
        this.animalMapper = animalMapper;
        this.userService = userService;
        this.subscriptionService = subscriptionService;
        this.minioService = minioService;
    }

    public AnimalPageResponse petFeed(AnimalFeedFilter filter) {
        log.info("Запрос на выдачу всех животных с фильтром: {}", filter);

        try {
            // Валидация и установка значений по умолчанию
            int pageSize = filter.size() != null && filter.size() > 0 ? filter.size() : 10;
            int pageNumber = filter.page() != null && filter.page() >= 0 ? filter.page() : 0;

            // Создание Pageable
            Pageable pageable = PageRequest.of(pageNumber, pageSize);

            long startTime = System.currentTimeMillis();

            // Выполнение запроса с фильтром и пагинацией
            Page<AnimalEntity> animalsEntityPage = animalRepository.findAllByFilter(
                    filter.age(),
                    filter.breed(),
                    filter.gender(),
                    filter.animalType(),
                    pageable
            );

            long endTime = System.currentTimeMillis();

            log.info("Поиск завершен за {} мс, найдено: {} животных",
                    (endTime - startTime), animalsEntityPage.getTotalElements());

            // Конвертация Entity в DTO страницу
            Page<Animal> animalsPage = animalsEntityPage.map(animalMapper::convertEntityToDTO);

            // Конвертация в Response
            AnimalPageResponse response = animalMapper.toPageResponse(animalsPage);
            return response;

        } catch (Exception ex) {
            log.error("Ошибка при загрузке животных: {}", ex.getMessage(), ex);
            return new AnimalPageResponse(List.of(), 0, 0, 0, 0, true, true, true);
        }
    }
    public Animal findAnimalById(Long id) {
        return animalMapper.convertEntityToDTO(
                findAnimalEntityById(id)
        );
    }
    public AnimalEntity findAnimalEntityById(Long id) {
        return animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Питомец не найден"));
    }

    public AnimalProfileResponse profile(Long id){
        return animalMapper.convertEntityToProfile(
                findAnimalEntityById(id)
        );
    }

    @Transactional
    public Animal save(CreatedAnimalRequest request, MultipartFile avatarFile) {
        try {
            UserEntity user = userService.getCurrentUser();
            if(user.getOwner() == null) {
                log.warn("Для начало создайте питомник");
                throw new RuntimeException("Для начало создайте питомник");
            }

            isValid(user);

            AnimalEntity animalEntity = animalRepository.save(
                    AnimalEntity.builder()
                            .name(request.name())
                            .age(request.age())
                            .description(request.description())
                            .imageURL(minioService.uploadFile(bucket,avatarFile))
                            .breed(request.breed())
                            .gender(request.gender())
                            .animalType(request.animalType())
                            .status(StatusAnimal.DONT_TAKE)
                            .owner(userService.getCurrentUser().getOwner())
                            .createAt(LocalDateTime.now())
                            .build()
            );
            return animalMapper.convertEntityToDTO(animalEntity);
        }catch (Exception e) {
            log.error("Не удалось создать питомеца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public Animal update(Long id,AnimalEntity updatedEntity){
        try {
            AnimalEntity animal = findAnimalEntityById(id);
            AnimalEntity animalEntity = animalRepository.save(
                    AnimalEntity.builder()
                            .id(animal.getId())
                            .name(animal.getName())
                            .age(updatedEntity.getAge())
                            .description(updatedEntity.getDescription())
                            .breed(animal.getBreed())
                            .gender(animal.getGender())
                            .animalType(animal.getAnimalType())
                            .status(updatedEntity.getStatus())
                            .personTakeId(updatedEntity.getPersonTakeId())
                            .owner(animal.getOwner())
                            .createAt(animal.getCreateAt())
                            .build()
            );
            return animalMapper.convertEntityToDTO(animalEntity);
        }catch (Exception e){
            log.error("Не удалось обновить питомца");
            throw new RuntimeException(e.getMessage());
        }
    }

    @Transactional
    public TakeResponse takenAnimal(Long id) {
        try {
            AnimalEntity animal = animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Животное не найдено"));

            if (animal.getStatus().name().equals("TAKE")) {
                throw new IllegalArgumentException("Данный питомец был взят");
            }

            animal.setStatus(StatusAnimal.RESERVATION);
            animalRepository.save(animal);

            return new TakeResponse(
                    "Вы успешно зарезервировали питомца",
                    animal.getOwner().getOwner().getEmail(),
                    animal.getName()
            );
        }catch (Exception e) {
            log.error("Не удалось взять питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }


    private void isValid(UserEntity user) {
        List<AnimalEntity> animalEntities = user.getOwner().getAnimals()
                .stream()
                .filter(el -> el.getStatus() == StatusAnimal.DONT_TAKE ||
                        el.getStatus() == StatusAnimal.RESERVATION)
                .toList();
        if(subscriptionService.findByUserEmail(user.getEmail()).getActive() == Status.BLOCKED &&
                animalEntities.size() >= 3) {
            log.warn("Нельзя создать больше 3 активных питомцев");
            throw new RuntimeException("Нельзя создать больше 3 активных питомцев");
        }
    }

}
