package org.example.tula.animals.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.AnimalFeedFilter;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.api.dto.response.AnimalPageResponse;
import org.example.tula.animals.api.dto.response.AnimalProfileResponse;
import org.example.tula.animals.domain.AnimalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
@Tag(name = "Animal", description = "Управление животными")
public class AnimalController {

    private final AnimalService animalService;

    @Operation(summary = "Получение питомцев с фильтром")
    @GetMapping
    public ResponseEntity<AnimalPageResponse> getAllAnimalsFiltered(@ModelAttribute AnimalFeedFilter filter) {
        return ResponseEntity.ok(animalService.petFeed(filter));
    }

    @Operation(summary = "Получение информации о питомце")
    @GetMapping("/{id}")//TODO ВОзмодно удалить
    public ResponseEntity<Animal> getAnimal(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.findAnimalById(id));
    }

    @Operation(summary = "Профиль питомца")
    @GetMapping("/profile/{id}")
    public ResponseEntity<AnimalProfileResponse> profile(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.profile(id));
    }


}
