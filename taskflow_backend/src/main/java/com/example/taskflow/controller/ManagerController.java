package com.example.taskflow.controller;

import com.example.taskflow.dto.*;
import com.example.taskflow.service.ProjectService;
import com.example.taskflow.service.TaskService;
import com.example.taskflow.utils.ResponseHandler;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/managers")
public class ManagerController {
    private final ProjectService projectService;
    private final TaskService taskService;

    public ManagerController(ProjectService projectService, TaskService taskService) {
        this.projectService = projectService;
        this.taskService = taskService;
    }

    @PostMapping("/projects")
    public ResponseEntity<ResponseHandler<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest request, Authentication auth) {
        Long managerId = Long.parseLong(auth.getName());
        return projectService.create(request, managerId);
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ResponseHandler<Long>> deleteProject(@PathVariable Long id) {
        return projectService.delete(id);
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ResponseHandler<ProjectResponse>> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @GetMapping("/projects")
    public ResponseEntity<ResponseHandler<List<ProjectResponse>>> getProjects(Authentication auth) {
        Long managerId = Long.parseLong(auth.getName());
        return projectService.getProjects(managerId);
    }

    @PostMapping("/projects/{id}/members")
    public ResponseEntity<ResponseHandler<String>> addMembers(@PathVariable Long id, @Valid @RequestBody AddMembersRequest request) {
        return projectService.addMembers(id, request);
    }

    @GetMapping("/projects/{id}/members")
    public ResponseEntity<ResponseHandler<MembersResponse>> getMembers(@PathVariable Long id) {
        return projectService.getMembersByProjectId(id);
    }

    @PostMapping("/projects/{id}/tasks")
    public ResponseEntity<ResponseHandler<TaskResponse>> createTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        return taskService.create(id, request);
    }

    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<ResponseHandler<TaskResponse>> deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        return taskService.delete(projectId, taskId);
    }

    @GetMapping("/projects/members")
    public ResponseEntity<ResponseHandler<Long>> totalMembersInAllProjects(Authentication auth) {
        return projectService.getTotalMembersByManagerId(Long.parseLong(auth.getName()));
    }

    @GetMapping("/projects/tasks/stats")
    public ResponseEntity<ResponseHandler<TaskStatsDTO>> getTaskStats(Authentication auth) {
        Long managerId = Long.parseLong(auth.getName());
        return taskService.getTaskStatsByManagerId(managerId);
    }
}
