package com.example.taskflow.controller;

import com.example.taskflow.dto.TaskRequest;
import com.example.taskflow.dto.TaskResponse;
import com.example.taskflow.service.TaskService;
import com.example.taskflow.utils.ResponseHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/members")
public class MemberController {
    private final TaskService taskService;

    public MemberController(TaskService taskService) {
        this.taskService = taskService;
    }


    @GetMapping("/tasks/my")
    public ResponseEntity<ResponseHandler<List<TaskResponse>>> viewTasks(Authentication auth) {
        Long memberId = Long.parseLong(auth.getName());
        return taskService.viewTasks(memberId);
    }

    // (e.g., /tasks/2/status?status=completed)
    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<ResponseHandler<TaskResponse>> updateTaskStatus(@PathVariable Long id, @RequestParam String status, Authentication auth) {
        Long memberId = Long.parseLong(auth.getName());
        return taskService.updateStatusById(id, status, memberId);
    }

    // (e.g., /tasks/2/priority?priority=high)
    @PatchMapping("/tasks/{id}/priority")
    public ResponseEntity<ResponseHandler<TaskResponse>> updateTaskPriority(@PathVariable Long id, @RequestParam String priority, Authentication auth) {
        Long memberId = Long.parseLong(auth.getName());
        return taskService.updatePriorityById(id, priority, memberId);
    }

}
