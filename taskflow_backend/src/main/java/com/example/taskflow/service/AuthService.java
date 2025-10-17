package com.example.taskflow.service;

import com.example.taskflow.dto.AuthResponse;
import com.example.taskflow.dto.LoginRequest;
import com.example.taskflow.dto.RegisterRequest;
import com.example.taskflow.entity.User;
import com.example.taskflow.enums.RoleType;
import com.example.taskflow.enums.TaskStatus;
import com.example.taskflow.repository.UserRepository;
import com.example.taskflow.utils.JwtAuth;
import com.example.taskflow.utils.ResponseHandler;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuth jwtAuth;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtAuth jwtAuth) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtAuth = jwtAuth;
    }

    public ResponseEntity<ResponseHandler<AuthResponse>> register(RegisterRequest request) {
        logger.info("Registration attempt for email: {}", request.getEmail());
        
        if(userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed - email already exists: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ResponseHandler.error("Email already registered!", HttpStatus.CONFLICT.value()));
        }

        User user = new User();

        if(request.getRole().equalsIgnoreCase("manager")) {
            user.setRole(RoleType.MANAGER);
        } else if(request.getRole().equalsIgnoreCase("member")) {
            user.setRole(RoleType.MEMBER);
        } else if(request.getRole().equalsIgnoreCase("admin")) {
            user.setRole(RoleType.ADMIN);
        } else {
            logger.warn("Registration failed - invalid role: {}", request.getRole());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseHandler.error("Invalid role.", HttpStatus.BAD_REQUEST.value()));
        }

        String hashPassword = passwordEncoder.encode(request.getPassword());

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(hashPassword);
        user.setStatus(Boolean.TRUE);

        userRepository.save(user);
        
        logger.info("User registered successfully - ID: {}, Email: {}, Role: {}", user.getId(), user.getEmail(), user.getRole());
        
        AuthResponse response = new AuthResponse(user.getId(), user.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseHandler.success("User registered successfully.", response, HttpStatus.CREATED.value()));
    }

    public ResponseEntity<ResponseHandler<AuthResponse>> login(LoginRequest request, HttpServletResponse response) {
        logger.info("Login attempt for email: {}", request.getEmail());
        
        Optional<User> optUser = userRepository.findByEmail(request.getEmail());

        if(optUser.isEmpty()) {
            logger.warn("Login failed - user not found: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseHandler.error("Invalid credentials.", HttpStatus.UNAUTHORIZED.value()));
        }

        User user = optUser.get();

        if(!user.getStatus()) {
            logger.warn("Login failed - account inactive: {} (UserID: {})", request.getEmail(), user.getId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseHandler.error("Account is inactive. Contact admin.", 403));
        }
        
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed - incorrect password: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseHandler.error("Invalid credentials.", HttpStatus.UNAUTHORIZED.value()));
        }

        String token = jwtAuth.generateToken(user.getId(), user.getRole().name());
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);

        // For development:
        cookie.setSecure(false);   // use true if using HTTPS (production)
        cookie.setAttribute("SameSite", "Lax"); // for local dev; use "None" with HTTPS in production

        response.addCookie(cookie);

        logger.info("Login successful - UserID: {}, Email: {}, Role: {}", user.getId(), user.getEmail(), user.getRole());

        AuthResponse authResponse = new AuthResponse(user.getId(), user.getName(), user.getEmail(), token, user.getRole());
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("User logged in successfully.", authResponse, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<Object>> logout(HttpServletResponse response) {
        logger.info("Logout request received");
        
        Cookie cookie = new Cookie("token", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        response.addCookie(cookie);

        logger.info("Logout successful");
        return ResponseEntity.ok(ResponseHandler.success("Logged out successfully", null, HttpStatus.OK.value()));
    }

}
