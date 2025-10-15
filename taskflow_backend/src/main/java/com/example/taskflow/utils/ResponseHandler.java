package com.example.taskflow.utils;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@Data
public class ResponseHandler<T> {
    private boolean success;
    private String message;
    private T data;
    private int statusCode;
    private LocalDateTime timestamp;

    public ResponseHandler(boolean success, String message, T data, int statusCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ResponseHandler<T> success(String message, T data, int statusCode) {
        return new ResponseHandler<>(true, message, data, statusCode);
    }

    public static <T> ResponseHandler<T> error(String message, int statusCode) {
        return new ResponseHandler<>(false, message, null, statusCode);
    }

    public static <T> ResponseHandler<T> error(String message, int statusCode, T data) {
        return new ResponseHandler<>(false, message, data, statusCode);
    }

    public static <T> ResponseEntity<ResponseHandler<T>> notFound(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseHandler.error(message, HttpStatus.NOT_FOUND.value()));
    }
}
