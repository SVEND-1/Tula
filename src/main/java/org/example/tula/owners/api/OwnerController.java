package org.example.tula.owners.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.domain.AnimalImageService;
import org.example.tula.animals.domain.AnimalService;
import org.example.tula.owners.api.dto.response.OwnerProfileResponse;
import org.example.tula.owners.domain.OwnerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
@Tag(name = "Owner", description = "Управление приютом")
public class OwnerController {
    private final OwnerService ownerService;
    private final AnimalService animalService;
    private final AnimalImageService animalImageService;

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
    @PostMapping(value = "/animal", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Animal> createAnimal(@RequestPart CreatedAnimalRequest request,
                                               @RequestPart(value = "avatar") MultipartFile avatarFile) {
        return ResponseEntity.ok(animalService.save(request,avatarFile));
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

    @Operation(summary = "Выгрузка картинки питомца")
    @PatchMapping(value = "/animal-img/{animalId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadAnimalImage(
            @PathVariable("animalId") Long animalId,
            @Parameter(
                    description = "Файл для загрузки",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestPart("file") MultipartFile file
    ) {
        String path = animalImageService.uploadImage(animalId, file);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(path);
    }

    @Operation(summary = "Получить URL картинки питомца")
    @GetMapping("/animal-img/{animalId}")
    public ResponseEntity<String> getAnimalImageUrl(
            @PathVariable("animalId") Long animalId
    ) {
        String url = animalImageService.getAnimalImageUrl(animalId);

        if (url == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(url);
    }

    @Operation(summary = "Удалить картинку питомца")
    @DeleteMapping("/animal-img/{animalId}")
    public ResponseEntity<Void> deleteAnimalImage(
            @PathVariable("animalId") Long animalId
    ) {
        animalImageService.deleteAnimalImage(animalId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

}
