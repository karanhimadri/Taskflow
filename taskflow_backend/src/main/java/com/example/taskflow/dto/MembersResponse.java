package com.example.taskflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembersResponse {
    private Long projectId;
    private String name;
    private List<AuthResponse> members;
}
