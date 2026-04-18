package org.example.tula.payments.api.dto.response.payment;

public record PaymentCreateResponse(
        String paymentId,
        String urlPay
) {
}
