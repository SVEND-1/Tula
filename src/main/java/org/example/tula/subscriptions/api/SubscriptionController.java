package org.example.tula.subscriptions.api;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.example.tula.subscriptions.api.dto.response.SubscriptionDetailResponse;
import org.example.tula.subscriptions.domain.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscription")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @Operation(summary = "Получить информацию о подписке")
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDetailResponse> getSubscription(@PathVariable("id") Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscription(id));
    }

    @Operation(summary = "Оформить/Продлить подписку")
    @PostMapping("/{paymentId}")
    public ResponseEntity<String> subscribe(
            @PathVariable String paymentId
    ) {
        return ResponseEntity.ok().body(subscriptionService.createSubscription(paymentId));
    }
}
