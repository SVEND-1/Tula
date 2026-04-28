package org.example.tula.owners.domain.exceptions;

public class OwnerNotCreatedException extends RuntimeException {
    public OwnerNotCreatedException(String message) {
        super(message);
    }
}
