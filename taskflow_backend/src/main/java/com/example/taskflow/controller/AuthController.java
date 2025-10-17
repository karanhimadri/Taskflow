package com.example.taskflow.controller;

import com.example.taskflow.dto.AuthResponse;
import com.example.taskflow.dto.LoginRequest;
import com.example.taskflow.service.AuthService;
import com.example.taskflow.service.EmailService;
import com.example.taskflow.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    @Autowired private EmailService emailService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseHandler<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        return authService.login(request, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseHandler<Object>> logout(HttpServletResponse response) {
        return authService.logout(response);
    }

    @GetMapping("/send-email")
    public String sendEmail(@RequestParam String to) {
        emailService.sendEmail(to, "Test Email from Spring Boot", "Hello! This is a test email.");
        return "Email sent to " + to;
    }

    @GetMapping("/send-welcome-email")
    public String sendWelcomeEmail(@RequestParam String to, @RequestParam String name) throws MessagingException {
        emailService.sendWelcomeEmail(to, "Welcome to Our Service!", name);
        return "Email sent successfully to " + to;
    }
}
