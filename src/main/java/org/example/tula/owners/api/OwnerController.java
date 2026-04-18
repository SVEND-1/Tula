package org.example.tula.owners.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.owners.domain.OwnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
public class OwnerController {
    private final OwnerService ownerService;

    @GetMapping
    public ResponseEntity<List<Animal>> findAnimalByOwner() {
        return ResponseEntity.ok(ownerService.findAllAnimalByOwner());
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
