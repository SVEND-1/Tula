package org.example.tula.animals.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.domain.AnimalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animal")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<Animal>> getAllAnimals() {
        return ResponseEntity.ok(animalService.findAllAnimals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimal(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.findAnimalById(id));
    }

    @PostMapping
    public ResponseEntity<Animal> createAnimal(@RequestBody CreatedAnimalRequest request) {
        return ResponseEntity.ok(animalService.save(request));
    }

    @PutMapping("/take/{id}")
    public ResponseEntity<String> takenAnimal(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.takenAnimal(id));
    }

    @PutMapping("/rejection/{id}")
    public ResponseEntity<String> rejectionTakenAnimal(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.rejectionTakenAnimal(id));
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<String> confirmTakenAnimal(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.confirmTakenAnimal(id));
    }
}
