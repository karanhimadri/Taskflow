package com.example.taskflow.service;

import com.example.taskflow.dto.AuthResponse;
import com.example.taskflow.dto.RegisterRequest;
import com.example.taskflow.entity.User;
import com.example.taskflow.repository.UserRepository;
import com.example.taskflow.utils.JwtAuth;
import com.example.taskflow.utils.ResponseHandler;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtAuth jwtAuth;

    @InjectMocks
    private AuthService authService;


    // TEST 1: Successful register
    @Test
    void testRegister_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Himadri Karan");
        request.setEmail("himadrikaran516@gmail.com");
        request.setPassword("12345");
        request.setRole("MEMBER");

        when(userRepository.existsByEmail("himadrikaran516@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("12345")).thenReturn("hash12345");

        ResponseEntity<ResponseHandler<AuthResponse>> response = authService.register(request);

        assertEquals(201, response.getStatusCode().value());
        Assertions.assertNotNull(response.getBody());
        assertEquals("User registered successfully.", response.getBody().getMessage());

        verify(userRepository, times(1)).save(any(User.class));
    }
}
