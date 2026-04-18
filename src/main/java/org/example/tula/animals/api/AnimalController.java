package org.example.tula.animals.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.AnimalFeedFilter;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.domain.AnimalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;

    @GetMapping()
    public ResponseEntity<List<Animal>> getAllAnimalsFiltered(@ModelAttribute AnimalFeedFilter filter) {
        return ResponseEntity.ok(animalService.petFeed(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> profile(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.findAnimalById(id));
    }

    @PostMapping
    public ResponseEntity<Animal> createAnimal(@RequestBody CreatedAnimalRequest request) {
        return ResponseEntity.ok(animalService.save(request));
    }

}
