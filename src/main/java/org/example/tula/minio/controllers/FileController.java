package org.example.tula.minio.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.example.tula.minio.services.MinioService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final MinioService minioService;

    @PostMapping(value = "/upload/{moduleKey}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Загрузить файл в указанный модуль")
    public ResponseEntity<String> uploadFile(
            @PathVariable String moduleKey,
            @Parameter(description = "Файл для загрузки", required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(type = "string", format = "binary")))
            @RequestPart("file") MultipartFile file) {
        String objectPath = minioService.uploadFile(moduleKey, file);
        return ResponseEntity.ok(objectPath);
    }

    @GetMapping("/download/{moduleKey}/{fileName:.+}")
    @Operation(summary = "Скачать файл по имени")
    public ResponseEntity<InputStreamResource> downloadFile(
            @PathVariable String moduleKey,
            @PathVariable String fileName) {
        // Восстанавливаем полный путь: moduleKey/fileName
        String objectPath = moduleKey + "/" + fileName;
        InputStream stream = minioService.getFile(moduleKey, objectPath);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM) // Или определите по расширению
                .body(new InputStreamResource(stream));
    }
}
