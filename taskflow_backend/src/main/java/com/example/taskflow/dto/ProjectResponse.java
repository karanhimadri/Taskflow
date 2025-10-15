package com.example.taskflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String created_by;

    public ProjectResponse(Long id, String name, String description, String created_by) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.created_by = created_by;
    }

    public ProjectResponse(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
