package org.example.tula.likes.api;

import lombok.RequiredArgsConstructor;
import org.example.tula.likes.api.dto.Like;
import org.example.tula.likes.domain.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/like/{id}")
    public ResponseEntity<Like> like(@PathVariable Long id) {
        return ResponseEntity.ok(likeService.like(id));
    }

    @PostMapping("/dislike/{id}")
    public ResponseEntity<Like> dislike(@PathVariable Long id) {
        return ResponseEntity.ok(likeService.dislike(id));
    }
}
