package org.example.tula.follow.api;

import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.tula.follow.api.dto.Follow;
import org.example.tula.follow.domain.FollowService;
import org.example.tula.owners.api.dto.Owner;
import org.example.tula.owners.api.dto.response.OwnerProfileResponse;
import org.example.tula.reviews.db.ReviewEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @Operation(summary = "Найти подписку")
    @GetMapping("/{id}")
    public ResponseEntity<Follow> findById(@PathVariable Long id) {
        return ResponseEntity.ok(followService.findById(id));
    }

    @Operation(summary = "Найти приют по подписке")
    @GetMapping("/owner/{followId}")
    public ResponseEntity<OwnerProfileResponse> findOwnerById(@PathVariable Long followId) {
        return ResponseEntity.ok(followService.findOwnerByFollowId(followId));
    }

    @Operation(summary = "Найти количество подписчиков в приюте")
    @GetMapping("/counter/{ownerId}")
    public ResponseEntity<Integer> countByFollowId(@PathVariable Long ownerId) {
        return ResponseEntity.ok(followService.countFollowersByOwner(ownerId));
    }

    @Operation(summary = "Найти все подписки пользователя")
    @GetMapping
    public ResponseEntity<List<Owner>> findAll() {
        return ResponseEntity.ok(followService.findAllOwners());
    }

    @Operation(summary = "Создать подписку")
    @PostMapping("/{ownerId}")
    public ResponseEntity<String> save(@PathVariable Long ownerId) {
        return ResponseEntity.ok(followService.save(ownerId));
    }

    @Operation(summary = "Удалить подписку")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(followService.deleted(id));
    }
}
