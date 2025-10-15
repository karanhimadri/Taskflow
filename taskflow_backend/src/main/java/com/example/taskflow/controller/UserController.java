package com.example.taskflow.controller;

import com.example.taskflow.dto.AuthResponse;
import com.example.taskflow.service.UserService;
import com.example.taskflow.utils.ResponseHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseHandler<AuthResponse>> getUserDetails(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        return userService.getUserDetails(userId);
    }

    @GetMapping("/projects/{projectId}/available-members")
    public ResponseEntity<ResponseHandler<List<AuthResponse>>> getAvailableMembers(@PathVariable Long projectId, @RequestParam String query) {
        return userService.searchAvailableMembers(projectId, query);
    }

    @GetMapping("/projects/{projectId}/tasks/available-members")
    public ResponseEntity<ResponseHandler<List<AuthResponse>>> getAvailableMembersForTask(@PathVariable Long projectId) {
        return userService.findAvailableMembersForTaskByProjectId(projectId);
    }
}
