package com.example.taskflow.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    
    @NotNull(message = "Member ID is required")
    @Positive(message = "Member ID must be a positive number")
    private Long memberId;
    
    @NotBlank(message = "Task title is required")
    @Size(min = 3, max = 200, message = "Task title must be between 3 and 200 characters")
    private String taskTitle;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    private LocalDate dueDate;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "(?i)todo|in_progress|done", message = "Status must be TODO, IN_PROGRESS, or DONE")
    private String status;
    
    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "(?i)low|medium|high", message = "Priority must be LOW, MEDIUM, or HIGH")
    private String priority;
}
