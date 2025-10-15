package com.example.taskflow.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMembersRequest {
    
    @NotNull(message = "Member IDs list cannot be null")
    @NotEmpty(message = "At least one member ID is required")
    private List<Long> memberIds;
}
