package org.example.tula.follow.domain.exceptions;

public class SelfSubscriptionNotAllowedException extends RuntimeException {
    public SelfSubscriptionNotAllowedException(String message) {
        super(message);
    }
}
