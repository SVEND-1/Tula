package org.example.tula.payments.domain.exception;

public class PaymentOwnershipException extends RuntimeException {

    public PaymentOwnershipException(String message) {
        super(message);
    }
}
