package org.example.tula.animals.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.AnimalFeedFilter;
import org.example.tula.animals.api.dto.request.AnimalUpdateRequest;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.api.dto.response.AnimalPageResponse;
import org.example.tula.animals.api.dto.response.AnimalProfileResponse;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.db.AnimalRepository;
import org.example.tula.animals.db.StatusAnimal;
import org.example.tula.owners.domain.exceptions.OwnerNotCreatedException;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.likes.api.dto.response.TakeResponse;
import org.example.tula.likes.db.LikeEntity;
import org.example.tula.likes.domain.LikeService;
import org.example.tula.subscriptions.domain.SubscriptionService;
import org.example.tula.users.db.UserEntity;
import org.example.tula.users.domain.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final AnimalMapper animalMapper;
    private final UserService userService;
    private final AnimalImageService animalImageService;

    public AnimalService(AnimalRepository animalRepository, AnimalMapper animalMapper,
                         @Lazy UserService userService,
                         AnimalImageService animalImageService) {
        this.animalRepository = animalRepository;
        this.animalMapper = animalMapper;
        this.userService = userService;
        this.animalImageService = animalImageService;
    }

    //====================================CONTROLLER METHODS=======================================================

    public AnimalPageResponse petFeed(AnimalFeedFilter filter) {
        try {
            int pageSize = filter.size() != null && filter.size() > 0 ? filter.size() : 10;
            int pageNumber = filter.page() != null && filter.page() >= 0 ? filter.page() : 0;

            Pageable pageable = PageRequest.of(pageNumber, pageSize);

            long startTime = System.currentTimeMillis();

            Long userId = userService.getCurrentUser().getId();

            Page<AnimalEntity> animalsEntityPage = animalRepository.findAllByFilter(
                    filter.age(),
                    filter.breed(),
                    filter.gender(),
                    filter.animalType(),
                    userId,
                    pageable
            );

            long endTime = System.currentTimeMillis();

            log.info("Поиск завершен за {} мс, найдено: {} животных",
                    (endTime - startTime), animalsEntityPage.getTotalElements());

            Page<Animal> animalsPage = animalsEntityPage.map(animalMapper::convertEntityToDTO);

            return animalMapper.toPageResponse(animalsPage);
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

    public AnimalProfileResponse profile(Long id) {
        return animalMapper.convertEntityToProfile(
                findAnimalEntityById(id)
        );
    }

    @Transactional
    public Animal save(CreatedAnimalRequest request, MultipartFile file) {
        try {
            UserEntity user = userService.getCurrentUser();
            if (user.getOwner() == null) {
                log.warn("Для начало создайте питомник");
                throw new OwnerNotCreatedException("Для начало создайте питомник");
            }

            String imagePath = animalImageService.uploadImageForNewForm(file);

            AnimalEntity animalEntity = animalRepository.save(
                    AnimalEntity.builder()
                            .name(request.name())
                            .age(request.age())
                            .description(request.description())
                            .breed(request.breed())
                            .gender(request.gender())
                            .animalType(request.animalType())
                            .status(StatusAnimal.DONT_TAKE)
                            .owner(userService.getCurrentUser().getOwner())
                            .imagePath(imagePath)
                            .createAt(LocalDateTime.now())
                            .build()
            );
            return animalMapper.convertEntityToDTO(animalEntity);
        } catch (Exception e) {
            log.error("Не удалось создать питомца, ex={}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public Animal update(Long id, AnimalUpdateRequest request) {
        try {
            AnimalEntity animal = findAnimalEntityById(id);
            AnimalEntity animalEntity = animalRepository.save(
                    AnimalEntity.builder()
                            .id(animal.getId())
                            .name(request.name())
                            .age(request.age())
                            .description(request.description())
                            .breed(animal.getBreed())
                            .gender(animal.getGender())
                            .animalType(animal.getAnimalType())
                            .status(animal.getStatus())
                            .personTakeId(animal.getPersonTakeId())
                            .owner(animal.getOwner())
                            .createAt(animal.getCreateAt())
                            .build()
            );
            return animalMapper.convertEntityToDTO(animalEntity);
        } catch (Exception e) {
            log.error("Не удалось обновить питомца");
            throw new RuntimeException(e.getMessage());
        }
    }

    @Transactional
    public String deleteAnimal(Long id) {
        try {
            AnimalEntity animal = findAnimalEntityById(id);
            List<LikeEntity> likeEntities = animal.getLikes();

            animalImageService.deleteAnimalImage(id);
            animalRepository.deleteById(id);
            return "Успешно";
        }catch (Exception e) {
            log.error("Не получилось удалить питомца с id={}", id, e);
            throw new RuntimeException(e);
        }
    }

    //====================================SERVICE METHODS=======================================================

    public AnimalEntity findAnimalEntityById(Long id) {
        return animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Питомец не найден"));
    }


    public Animal updateTake(Long id,StatusAnimal status,Long userId) {
        try {
            AnimalEntity animal = findAnimalEntityById(id);
            if (userId != null)
                animal.setPersonTakeId(userId);
            animal.setStatus(status);

            return animalMapper.convertEntityToDTO(animal);
        } catch (Exception e) {
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
        } catch (Exception e) {
            log.error("Не удалось взять питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

//    private void isValid(UserEntity user) {TODO подумать надо это или нет
//        List<AnimalEntity> animalEntities = user.getOwner().getAnimals()
//                .stream()
//                .filter(el -> el.getStatus() == StatusAnimal.DONT_TAKE ||
//                        el.getStatus() == StatusAnimal.RESERVATION)
//                .toList();
//        if (subscriptionService.findByUserEmail(user.getEmail()).getActive() == Status.BLOCKED &&
//                animalEntities.size() >= 3) {
//            log.warn("Нельзя создать больше 3 активных питомцев");
//            throw new RuntimeException("Нельзя создать больше 3 активных питомцев");
//        }
//    }

}
