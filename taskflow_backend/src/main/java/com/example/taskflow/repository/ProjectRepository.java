package com.example.taskflow.repository;

import com.example.taskflow.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query(value = """
        SELECT COUNT(DISTINCT pm.member_id)
        FROM project_member pm
        JOIN projects p ON p.id = pm.project_id
        WHERE p.manager_id = :managerId
    """, nativeQuery = true)
    long countMembersByManagerId(@Param("managerId") Long managerId);
}
