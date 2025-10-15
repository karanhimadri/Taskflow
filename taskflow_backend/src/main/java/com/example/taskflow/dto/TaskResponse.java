package com.example.taskflow.dto;

import com.example.taskflow.enums.PriorityType;
import com.example.taskflow.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskResponse {
    private Long id;
    private String taskTitle;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
    private PriorityType priority;
    private String projectName;
    private String assignedTo;

    public TaskResponse(Long id, String taskTitle, String description, LocalDate dueDate, TaskStatus status, PriorityType priority) {
        this.id = id;
        this.taskTitle = taskTitle;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
        this.priority = priority;
    }

    public TaskResponse(Long id, String taskTitle) {
        this.id = id;
        this.taskTitle = taskTitle;
    }
}
