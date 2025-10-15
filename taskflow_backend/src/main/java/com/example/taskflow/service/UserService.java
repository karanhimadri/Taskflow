package com.example.taskflow.service;

import com.example.taskflow.dto.AuthResponse;
import com.example.taskflow.entity.User;
import com.example.taskflow.repository.UserRepository;
import com.example.taskflow.utils.ResponseHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<ResponseHandler<AuthResponse>> getUserDetails(Long userId) {
        logger.info("Fetching user details for user ID: {}", userId);
        
        Optional<User> optUser = userRepository.findById(userId);

        if(optUser.isEmpty()) {
            logger.warn("User not found: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseHandler.error("User not found.", HttpStatus.NOT_FOUND.value()));
        }

        User user = optUser.get();

        if(!user.getStatus()) {
            logger.warn("Access denied - user account inactive: {}", userId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseHandler.error("Account is inactive. Contact admin.", HttpStatus.FORBIDDEN.value()));
        }

        logger.info("User details fetched successfully - User ID: {}, Email: {}", user.getId(), user.getEmail());

        AuthResponse response = new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("User details fetched.", response, HttpStatus.OK.value()));

    }

    public ResponseEntity<ResponseHandler<List<AuthResponse>>> searchAvailableMembers(Long projectId, String query) {
        if(query == null || query.isBlank()) {
            return ResponseHandler.notFound("Search query cannot be empty.");
        }

        List<User> availableMembers = userRepository.searchAvailableMembers(query, projectId);

        if(availableMembers.isEmpty()) {
            return ResponseHandler.notFound("Members not found.");
        }

        List<AuthResponse> response = availableMembers.stream().map(m -> new AuthResponse(m.getId(), m.getName(), m.getEmail())).toList();

        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Available members fetched.", response, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<List<AuthResponse>>> findAvailableMembersForTaskByProjectId(Long projectId) {
        List<User> members = userRepository.findAvailableForTask(projectId);

        if(members.isEmpty()) {
            return ResponseHandler.notFound("Members  not found.");
        }

        List<AuthResponse> response = members.stream().map(m -> new AuthResponse(m.getId(), m.getName(), m.getEmail())).toList();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Available members fetched.", response, HttpStatus.OK.value()));
    }
}
