package com.example.taskflow.repository;

import com.example.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query(value = """
        SELECT * FROM users u
        WHERE LOWER(u.name) LIKE LOWER(CONCAT(:query, '%'))
        AND u.role = 'MEMBER'
        AND u.status = true
        AND u.id NOT IN (
        SELECT pm.member_id FROM project_member pm
        WHERE pm.project_id = :projectId
        )
        ORDER BY u.id ASC LIMIT 10
""", nativeQuery = true)
    List<User> searchAvailableMembers(@Param("query") String query, @Param("projectId") Long projectId);

    @Query(value = """
        SELECT * FROM users u
        JOIN project_member pm ON pm.member_id = u.id
        WHERE pm.project_id = :projectId
        AND u.role = 'MEMBER'
        AND u.status = true
        AND NOT EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.assigned_to = u.id
            AND t.project_id = :projectId
            AND t.status IN ('TODO', 'IN_PROGRESS')
        )
        ORDER BY u.id
""", nativeQuery = true)
    List<User> findAvailableForTask(@Param("projectId") Long projectId);
}
