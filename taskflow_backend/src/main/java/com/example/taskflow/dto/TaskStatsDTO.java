package com.example.taskflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatsDTO {
    private long totalTasks;
    private long tasksInProgress;
    private double inProgressPercentage;
}
