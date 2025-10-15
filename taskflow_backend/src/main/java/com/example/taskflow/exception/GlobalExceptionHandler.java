package com.example.taskflow.exception;

import com.example.taskflow.utils.ResponseHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle validation errors from @Valid annotations
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseHandler<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        logger.warn("Validation error: {}", errors);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseHandler.error("Validation failed", HttpStatus.BAD_REQUEST.value(), errors));
    }

    /**
     * Handle database constraint violations (unique, foreign key, etc.)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseHandler<Object>> handleDatabaseErrors(
            DataIntegrityViolationException ex) {
        
        logger.error("Database integrity violation: {}", ex.getMessage());
        
        String message = "Database constraint violation";
        if (ex.getMessage().contains("unique") || ex.getMessage().contains("duplicate")) {
            message = "A record with this information already exists";
        } else if (ex.getMessage().contains("foreign key")) {
            message = "Cannot delete or modify - record is referenced by other data";
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ResponseHandler.error(message, HttpStatus.CONFLICT.value()));
    }

    /**
     * Handle type mismatch errors (e.g., passing string where number expected)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ResponseHandler<Object>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        
        logger.warn("Type mismatch error: {} for parameter {}", ex.getValue(), ex.getName());
        
        String message = String.format("Invalid value '%s' for parameter '%s'", 
                ex.getValue(), ex.getName());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseHandler.error(message, HttpStatus.BAD_REQUEST.value()));
    }

    /**
     * Handle access denied errors
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseHandler<Object>> handleAccessDenied(
            AccessDeniedException ex) {
        
        logger.warn("Access denied: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ResponseHandler.error("Access denied - insufficient permissions", 
                        HttpStatus.FORBIDDEN.value()));
    }

    /**
     * Handle authentication errors
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ResponseHandler<Object>> handleBadCredentials(
            BadCredentialsException ex) {
        
        logger.warn("Authentication failed: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ResponseHandler.error("Invalid credentials", 
                        HttpStatus.UNAUTHORIZED.value()));
    }

    /**
     * Handle all other unhandled exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseHandler<Object>> handleGenericErrors(
            Exception ex) {
        
        logger.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseHandler.error("An unexpected error occurred. Please try again later.", 
                        HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
