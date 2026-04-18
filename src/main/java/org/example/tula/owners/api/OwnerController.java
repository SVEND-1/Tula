package org.example.tula.owners.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.domain.AnimalService;
import org.example.tula.owners.api.dto.Owner;
import org.example.tula.owners.api.dto.response.OwnerProfileResponse;
import org.example.tula.owners.domain.OwnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
@Tag(name = "Owner", description = "Управление приютом")
public class OwnerController {
    private final OwnerService ownerService;
    private final AnimalService animalService;

    @Operation(summary = "Получение всех животных в приюте")
    @GetMapping("/animal")
    public ResponseEntity<List<Animal>> findAnimalByOwner() {
        return ResponseEntity.ok(ownerService.findAllAnimalByOwner());
    }

    @Operation(summary = "Профиль приюта")
    @GetMapping("/{id}")
    public ResponseEntity<OwnerProfileResponse> profile(@PathVariable Long id) {
        return ResponseEntity.ok(ownerService.profile(id));
    }

    @Operation(summary = "Создание питомца в приют")
    @PostMapping("/animal")
    public ResponseEntity<Animal> createAnimal(@RequestBody CreatedAnimalRequest request) {
        return ResponseEntity.ok(animalService.save(request));
    }

    @Operation(summary = "Создание приюта")
    @PostMapping()
    public ResponseEntity<String> createOwner(@RequestParam String name) {
        return ResponseEntity.ok(ownerService.createOwner(name));
    }

    @Operation(summary = "Отклонить заявку на взятие питомца")
    @PutMapping("/rejection/{likeId}")
    public ResponseEntity<String> rejectionTakenAnimal(@PathVariable Long likeId) {
        return ResponseEntity.ok(ownerService.rejectionTakenAnimal(likeId));
    }

    @Operation(summary = "Подтвердить заявку на взятие питомца")
    @PutMapping("/confirm/{likeId}")
    public ResponseEntity<String> confirmTakenAnimal(@PathVariable Long likeId) {
        return ResponseEntity.ok(ownerService.confirmTakenAnimal(likeId));
    }


}
