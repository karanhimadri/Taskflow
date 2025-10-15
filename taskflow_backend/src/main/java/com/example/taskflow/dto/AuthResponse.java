package com.example.taskflow.dto;

import com.example.taskflow.enums.RoleType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String token;
    private RoleType role;

    public AuthResponse(Long id, RoleType role) {
        this.id = id;
        this.role = role;
    }

    public AuthResponse(Long id, String name, String email, RoleType role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public AuthResponse(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
