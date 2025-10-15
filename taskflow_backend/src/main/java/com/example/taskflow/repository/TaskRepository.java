package com.example.taskflow.repository;

import com.example.taskflow.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findByIdAndProject_Id(Long id, Long projectId);

    Optional<Task> findByIdAndMember_Id(Long id, Long projectId);

    List<Task> findByMember_Id(Long memberId);

    @Query(value = """
        SELECT
            COUNT(*) AS total_tasks,
            COUNT(*) FILTER (WHERE t.status = 'IN_PROGRESS') AS tasks_in_progress,
            CASE WHEN COUNT(*) = 0 THEN 0 ELSE
                ROUND(COUNT(*) FILTER (WHERE t.status = 'IN_PROGRESS') * 100.0 / COUNT(*), 2)
            END AS in_progress_percentage
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE p.manager_id = :managerId
        """, nativeQuery = true)
    List<Object[]> findTaskStatsByManagerId(@Param("managerId") Long managerId);
}
