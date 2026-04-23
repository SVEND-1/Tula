package org.example.tula.likes.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.tula.likes.api.dto.Like;
import org.example.tula.likes.domain.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Tag(name = "Like", description = "Управление лайками")
public class LikeController {

    private final LikeService likeService;

    @Operation(summary = "Поставить лайк питомцу")
    @PostMapping("/like/{id}")
    public ResponseEntity<Like> like(@PathVariable Long id) {
        return ResponseEntity.ok(likeService.like(id));
    }

    @Operation(summary = "Поставить дизлайк питомцу")
    @PostMapping("/dislike/{id}")
    public ResponseEntity<Like> dislike(@PathVariable Long id) {
        return ResponseEntity.ok(likeService.dislike(id));
    }

    @Operation(summary = "Удаления лайка")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(likeService.deleted(id));
    }
}
