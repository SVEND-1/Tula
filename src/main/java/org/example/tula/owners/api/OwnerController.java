package org.example.tula.owners.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.domain.AnimalService;
import org.example.tula.owners.api.dto.Owner;
import org.example.tula.owners.domain.OwnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
public class OwnerController {
    private final OwnerService ownerService;
    private final AnimalService animalService;

    @GetMapping("/animal")
    public ResponseEntity<List<Animal>> findAnimalByOwner() {
        return ResponseEntity.ok(ownerService.findAllAnimalByOwner());
    }

    @PostMapping("/animal")
    public ResponseEntity<Animal> createAnimal(@RequestBody CreatedAnimalRequest request) {
        return ResponseEntity.ok(animalService.save(request));
    }

    @PostMapping()
    public ResponseEntity<String> createAnimal(@RequestParam String name) {
        return ResponseEntity.ok(ownerService.createOwner(name));
    }

    @PutMapping("/rejection/{likeId}")
    public ResponseEntity<String> rejectionTakenAnimal(@PathVariable Long likeId) {
        return ResponseEntity.ok(ownerService.rejectionTakenAnimal(likeId));
    }

    @PutMapping("/confirm/{likeId}")
    public ResponseEntity<String> confirmTakenAnimal(@PathVariable Long likeId) {
        return ResponseEntity.ok(ownerService.confirmTakenAnimal(likeId));
    }


}
