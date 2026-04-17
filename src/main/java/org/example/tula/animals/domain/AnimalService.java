package org.example.tula.animals.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.db.AnimalEntity;
import org.example.tula.animals.db.AnimalRepository;
import org.example.tula.animals.db.StatusAnimal;
import org.example.tula.animals.domain.mapper.AnimalMapper;
import org.example.tula.likes.api.dto.response.TakeResponse;
import org.example.tula.users.domain.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final AnimalMapper animalMapper;
    private final UserService userService;

    public Animal findAnimalById(Long id) {
        return animalMapper.convertEntityToDTO(
                animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Питомец не найден"))
        );
    }

    public List<Animal> findAllAnimals() {
        return animalMapper.convertEntityListToDTO(
                animalRepository.findAll()
        );
    }

    public Animal save(CreatedAnimalRequest request) {
        try {
            AnimalEntity animalEntity = animalRepository.save(//TODO добавть  владельца
                    AnimalEntity.builder()
                            .name(request.name())
                            .age(request.age())
                            .description(request.description())
                            .breed(request.breed())
                            .gender(request.gender())
                            .animalType(request.animalType())
                            .status(StatusAnimal.DONT_TAKE)
                            .build()
            );
            return animalMapper.convertEntityToDTO(animalEntity);
        }catch (Exception e) {
            log.error("Не удалось создать питомеца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public TakeResponse takenAnimal(Long id) {
        try {
            AnimalEntity animal = animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Животное не найдено"));

            if (animal.getStatus().name().equals("TAKE")) {
                throw new IllegalArgumentException("Данный питомец был взят");
            }

            animal.setPersonTakeId(userService.getCurrentUser().getId());
            animal.setStatus(StatusAnimal.RESERVATION);
            animalRepository.save(animal);

            return new TakeResponse(
                    "Вы успешно зарезервировали питомца",
                    "s5090@inbox.ru",//TODO поменять
                    animal.getName()
            );
        }catch (Exception e) {
            log.error("Не удалось взять питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public String rejectionTakenAnimal(Long id) {
        try {
            AnimalEntity animal = animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Животное не найдено"));

            if (animal.getPersonTakeId() == null) {
                throw new IllegalArgumentException("Нельзя отклонить заявку так как нету получателя");
            }
            //TODO ДОБАВИТЬ ПРОВЕРКУ НА ВЛАДЕЛЬЦА ЖИВОТНОГО

            animal.setPersonTakeId(null);
            animal.setStatus(StatusAnimal.DONT_TAKE);
            animalRepository.save(animal);

            return "Вы отказали в получение питомца";
        }catch (Exception e) {
            log.error("Не удалось отказать в получение питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public String confirmTakenAnimal(Long id) {
        try {
            AnimalEntity animal = animalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Животное не найдено"));

            if (animal.getPersonTakeId() == null) {
                throw new IllegalArgumentException("Нельзя одобрить заявку так как нету получателя");
            }

            if (animal.getStatus().name().equals("TAKE")) {
                throw new IllegalArgumentException("Данный питомец был взят");
            }

            //TODO ДОБАВИТЬ ПРОВЕРКУ НА ВЛАДЕЛЬЦА ЖИВОТНОГО

            animal.setStatus(StatusAnimal.TAKE);
            animalRepository.save(animal);

            return "Вы успешно одобрили получние питомца";
        }catch (Exception e) {
            log.error("Не удалось одобрить получние питомца,ex={}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

}
