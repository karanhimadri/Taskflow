package com.example.taskflow.service;

import com.example.taskflow.dto.*;
import com.example.taskflow.entity.Project;
import com.example.taskflow.entity.User;
import com.example.taskflow.repository.ProjectRepository;
import com.example.taskflow.repository.UserRepository;
import com.example.taskflow.utils.ResponseHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
    
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<ResponseHandler<ProjectResponse>> create(ProjectRequest request, Long userId) {
        logger.info("Creating project '{}' for manager ID: {}", request.getName(), userId);
        
        Optional<User> optManager = userRepository.findById(userId);

        if(optManager.isEmpty()) {
            logger.error("Project creation failed - manager not found: {}", userId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseHandler.error("Project not created.", HttpStatus.UNAUTHORIZED.value()));
        }

        User manager = optManager.get();

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setManager(manager);

        projectRepository.save(project);
        
        logger.info("Project created successfully - ID: {}, Name: {}, Manager: {}", 
                project.getId(), project.getName(), manager.getName());

        ProjectResponse response = new ProjectResponse(project.getId(), project.getName(), project.getDescription(), manager.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseHandler.success("Project created successfully.", response, HttpStatus.CREATED.value()));
    }

    public ResponseEntity<ResponseHandler<Long>> delete(Long projectId) {
        logger.info("Deleting project ID: {}", projectId);
        
        Optional<Project> project = projectRepository.findById(projectId);

        if(project.isEmpty()) {
            logger.warn("Project deletion failed - project not found: {}", projectId);
            return ResponseHandler.notFound("Project not found.");
        }

        projectRepository.delete(project.get());
        
        logger.info("Project deleted successfully - ID: {}", projectId);

        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Project deleted successfully.",project.get().getId(), HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<List<ProjectResponse>>> getProjects(Long userId) {
        logger.info("Fetching projects for manager ID: {}", userId);
        
        Optional<User> optManager = userRepository.findById(userId);

        if(optManager.isEmpty()) {
            logger.warn("Fetch projects failed - manager not found: {}", userId);
            return ResponseHandler.notFound("Projects not found.");
        }

        User manager = optManager.get();

        List<ProjectResponse> response  = manager.getManagedProjects().stream().map(p -> new ProjectResponse( p.getId(), p.getName(), p.getDescription())).collect(Collectors.toList());

        logger.info("Fetched {} projects for manager ID: {}", response.size(), userId);

        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Projects were fetched.", response, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<ProjectResponse>> getProjectById(Long projectId) {
        logger.info("Fetching project ID: {}", projectId);
        
        Optional<Project> project = projectRepository.findById(projectId);

        if(project.isEmpty()) {
            logger.warn("Project not found: {}", projectId);
            return ResponseHandler.notFound("Project not found.");
        }

        Project p = project.get();
        ProjectResponse response = new ProjectResponse(p.getId(), p.getName(), p.getDescription());

        logger.info("Project fetched successfully - ID: {}, Name: {}", p.getId(), p.getName());

        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Project fetched successfully.",response, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<String>> addMembers(Long projectId, AddMembersRequest request) {
        logger.info("Adding {} members to project ID: {}", request.getMemberIds().size(), projectId);
        
        Optional<Project> optProject = projectRepository.findById(projectId);

        if(optProject.isEmpty()) {
            logger.warn("Add members failed - project not found: {}", projectId);
            return ResponseHandler.notFound("Project not found.");
        }

        Project project = optProject.get();
        List<User> members = userRepository.findAllById(request.getMemberIds());

        if(members.isEmpty()) {
            logger.warn("Add members failed - no valid members found for IDs: {}", request.getMemberIds());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseHandler.error("No valid members found for given IDs.", HttpStatus.BAD_REQUEST.value()));
        }

        Set<User> currentMembers = new HashSet<>(project.getMembers());
        currentMembers.addAll(members);
        project.setMembers(new ArrayList<>(currentMembers));

        projectRepository.save(project);

        logger.info("Added {} members to project ID: {}", members.size(), projectId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Members added successfully.", null, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<MembersResponse>> getMembersByProjectId(Long projectId) {
        logger.info("Fetching members for project ID: {}", projectId);
        
        Optional<Project> optProject = projectRepository.findById(projectId);

        if(optProject.isEmpty()) {
            logger.warn("Get members failed - project not found: {}", projectId);
            return ResponseHandler.notFound("Project not found.");
        }

        Project project = optProject.get();
        List<AuthResponse> members = project.getMembers().stream().map(member -> new AuthResponse(
                member.getId(),
                member.getName(),
                member.getEmail())).toList();

        logger.info("Fetched {} members for project ID: {}", members.size(), projectId);

        MembersResponse response = new MembersResponse(project.getId(), project.getName(), members);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Members fetched successfully.", response, HttpStatus.OK.value()));
    }

    public ResponseEntity<ResponseHandler<Long>> getTotalMembersByManagerId(Long managerId) {
        Long totalMembers = projectRepository.countMembersByManagerId(managerId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseHandler.success("Total members fetched.", totalMembers, HttpStatus.OK.value()));
    }
}
