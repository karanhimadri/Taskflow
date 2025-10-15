package com.example.taskflow.service;

import com.example.taskflow.dto.TaskRequest;
import com.example.taskflow.dto.TaskResponse;
import com.example.taskflow.dto.TaskStatsDTO;
import com.example.taskflow.entity.Project;
import com.example.taskflow.entity.Task;
import com.example.taskflow.entity.User;
import com.example.taskflow.enums.PriorityType;
import com.example.taskflow.enums.TaskStatus;
import com.example.taskflow.repository.ProjectRepository;
import com.example.taskflow.repository.TaskRepository;
import com.example.taskflow.repository.UserRepository;
import com.example.taskflow.utils.ResponseHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
    
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<ResponseHandler<TaskResponse>> create(Long projectId, TaskRequest request) {
        logger.info("Creating task '{}' for project ID: {}, assigned to member ID: {}", 
                request.getTaskTitle(), projectId, request.getMemberId());
        
        Optional<Project> optProject = projectRepository.findById(projectId);
        Optional<User> optMember = userRepository.findById(request.getMemberId());

        if(optProject.isEmpty()) {
            logger.warn("Task creation failed - project not found: {}", projectId);
            return ResponseHandler.notFound("Project not found.");
        }

        if(optMember.isEmpty()) {
            logger.warn("Task creation failed - member not found: {}", request.getMemberId());
            return ResponseHandler.notFound("Member not found.");
        }

        User member = optMember.get();
        Project project = optProject.get();

        // Validate that member belongs to the project
        if(!project.getMembers().contains(member)) {
            logger.warn("Task creation failed - member ID {} is not part of project ID {}", 
                    member.getId(), project.getId());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseHandler.error("Member is not part of this project", 
                            HttpStatus.BAD_REQUEST.value()));
        }

        Task task = new Task();
        task.setTitle(request.getTaskTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
        task.setPriority(PriorityType.valueOf(request.getPriority().toUpperCase()));
        task.setProject(project);
        task.setMember(member);

        taskRepository.save(task);

        logger.info("Task created successfully - ID: {}, Title: {}, Project: {}, Member: {}", 
                task.getId(), task.getTitle(), project.getName(), member.getName());

        TaskResponse response = new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getDueDate(), task.getStatus(), task.getPriority(), project.getName(), member.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseHandler.success("Task created successfully.", response, HttpStatus.CREATED.value()));
    }

    public ResponseEntity<ResponseHandler<List<TaskResponse>>> viewTasks(Long memberId) {
        logger.info("Fetching tasks for member ID: {}", memberId);
        
        List<Task> tasks = taskRepository.findByMember_Id(memberId);

        if(tasks.isEmpty()) {
            logger.info("No tasks found for member ID: {}", memberId);
            return ResponseHandler.notFound("Tasks not found.");
        }

        List<TaskResponse> response = tasks.stream().map(task -> new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getDueDate(), task.getStatus(), task.getPriority())).toList();

        logger.info("Fetched {} tasks for member ID: {}", response.size(), memberId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Tasks fetched successfully.", response, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<TaskResponse>> updateStatusById(Long taskId, String status, Long memberId) {
        logger.info("Updating task status - Task ID: {}, New Status: {}, Member ID: {}", taskId, status, memberId);
        
        Optional<Task> optTask = taskRepository.findByIdAndMember_Id(taskId, memberId);

        if(optTask.isEmpty()) {
            logger.warn("Task status update failed - task not found: {} for member: {}", taskId, memberId);
            return ResponseHandler.notFound("Task not found.");
        }

        Task task = optTask.get();
        task.setStatus(TaskStatus.valueOf(status.toUpperCase()));

        taskRepository.save(task);

        logger.info("Task status updated successfully - Task ID: {}, New Status: {}", taskId, status);
        
        TaskResponse response = new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getDueDate(), task.getStatus(), task.getPriority());
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Task status updated to "+status+".", response, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<TaskResponse>> updatePriorityById(Long taskId, String priority, Long memberId) {
        logger.info("Updating task priority - Task ID: {}, New Priority: {}, Member ID: {}", taskId, priority, memberId);
        
        Optional<Task> optTask = taskRepository.findByIdAndMember_Id(taskId, memberId);

        if(optTask.isEmpty()) {
            logger.warn("Task priority update failed - task not found: {} for member: {}", taskId, memberId);
            return ResponseHandler.notFound("Task not found.");
        }

        Task task = optTask.get();
        task.setPriority(PriorityType.valueOf(priority.toUpperCase()));

        taskRepository.save(task);

        logger.info("Task priority updated successfully - Task ID: {}, New Priority: {}", taskId, priority);

        TaskResponse response = new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getDueDate(), task.getStatus(), task.getPriority());
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Task priority updated to "+priority+".", response, HttpStatus.OK.value()));
    }

    @Transactional
    public ResponseEntity<ResponseHandler<TaskResponse>> delete(Long projectId, Long taskId) {
        logger.info("Deleting task ID: {} from project ID: {}", taskId, projectId);
        
        Optional<Task> optTask = taskRepository.findByIdAndProject_Id(taskId, projectId);

        if (optTask.isEmpty()) {
            logger.warn("Task deletion failed - task not found: {} in project: {}", taskId, projectId);
            return ResponseHandler.notFound("Task not found for this project.");
        }

        taskRepository.delete(optTask.get());

        logger.info("Task deleted successfully - Task ID: {}", taskId);

        TaskResponse response = new TaskResponse(optTask.get().getId(), optTask.get().getTitle());
        return ResponseEntity.ok(ResponseHandler.success("Task deleted successfully.", response, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<TaskStatsDTO>> getTaskStatsByManagerId(Long managerId) {
        List<Object[]> results = taskRepository.findTaskStatsByManagerId(managerId);

        if(results.isEmpty()) {
            return ResponseHandler.notFound("No task stats found.");
        }

        Object[] result = results.get(0);

        long totalTasks = ((Number) result[0]).longValue();
        long tasksInProgress = ((Number) result[1]).longValue();
        double percentage = ((Number) result[2]).doubleValue();

        TaskStatsDTO response = new TaskStatsDTO(totalTasks, tasksInProgress, percentage);
        return ResponseEntity.ok(ResponseHandler.success("Task deleted successfully.", response, HttpStatus.OK.value()));
    }
}
