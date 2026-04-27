package org.example.tula.owners.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.tula.animals.api.dto.Animal;
import org.example.tula.animals.api.dto.request.AnimalUpdateRequest;
import org.example.tula.animals.api.dto.request.CreatedAnimalRequest;
import org.example.tula.animals.api.dto.response.AnimalImageResponse;
import org.example.tula.animals.domain.AnimalImageService;
import org.example.tula.animals.domain.AnimalService;
import org.example.tula.owners.api.dto.response.OwnerProfileResponse;
import org.example.tula.owners.domain.OwnerService;
import org.springframework.http.HttpStatus;
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
    @RequestBody(content = @Content(
            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
            encoding = {
                    @Encoding(name = "animal", contentType = MediaType.APPLICATION_JSON_VALUE),
                    @Encoding(name = "image", contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE)
            }
    ))
    public ResponseEntity<Animal> createAnimal(
            @Parameter(description = "Данные питомца в JSON", required = true)
            @RequestPart("animal") @Valid CreatedAnimalRequest request,
            @Parameter(description = "Изображение питомца", required = false)
            @RequestPart(value = "image", required = false) MultipartFile file
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(animalService.save(request, file));
    }

    @Operation(summary = "Обновление данных питомца")
    @PutMapping("/animal/{id}")
    public ResponseEntity<Animal> updateAnimal(@PathVariable Long id,
                                               @RequestBody AnimalUpdateRequest request) {
        return ResponseEntity.ok(animalService.update(id,request));
    }

    @Operation(summary = "Создание приюта")
    @PostMapping()
    public ResponseEntity<String> createOwner(@RequestParam String name) {
        return ResponseEntity.ok(ownerService.createOwner(name));
    }

    @Operation(summary = "Обновление название приюта")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateOwner(
            @PathVariable Long id,
            @RequestParam String name
    ) {
        return ResponseEntity.ok(ownerService.setOwnerName(id,name));
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
    public ResponseEntity<AnimalImageResponse> uploadAnimalImageById(
            @PathVariable("animalId") Long animalId,
            @Parameter(
                    description = "Файл для загрузки",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestPart("file") MultipartFile file
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(animalImageService.uploadImageById(animalId, file));
    }

    @Operation(summary = "Получить URL картинки питомца")
    @GetMapping("/animal-img/{animalId}")
    public ResponseEntity<String> getAnimalImageUrl(
            @PathVariable("animalId") Long animalId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(animalImageService.getAnimalImageUrl(animalId));
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

    @Operation(summary = "Удаление питомца")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnimal(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.deleteAnimal(id));
    }
}
