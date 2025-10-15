import axiosInstance from "../config/axiosConfig";
import type {
  ProjectRequest,
  ProjectResponse,
  AddMembersRequest,
  MembersResponse,
  TaskRequest,
  TaskResponse,
  ApiResponse,
  taskStats,
} from "../types/api.types";

class ManagerService {
  private readonly BASE_PATH = "/api/v1/managers";

  // Project Management
  async createProject(projectData: ProjectRequest): Promise<ApiResponse<ProjectResponse>> {
    const response = await axiosInstance.post<ApiResponse<ProjectResponse>>(
      `${this.BASE_PATH}/projects`,
      projectData
    );
    return response.data;
  }

  async getProjects(): Promise<ApiResponse<ProjectResponse[]>> {
    const response = await axiosInstance.get<ApiResponse<ProjectResponse[]>>(
      `${this.BASE_PATH}/projects`
    );
    return response.data;
  }

  async getProjectById(projectId: number): Promise<ApiResponse<ProjectResponse>> {
    const response = await axiosInstance.get<ApiResponse<ProjectResponse>>(
      `${this.BASE_PATH}/projects/${projectId}`
    );
    return response.data;
  }

  async deleteProject(projectId: number): Promise<ApiResponse<number>> {
    const response = await axiosInstance.delete<ApiResponse<number>>(
      `${this.BASE_PATH}/projects/${projectId}`
    );
    return response.data;
  }

  // Member Management
  async addMembers(projectId: number, memberData: AddMembersRequest): Promise<ApiResponse<string>> {
    const response = await axiosInstance.post<ApiResponse<string>>(
      `${this.BASE_PATH}/projects/${projectId}/members`,
      memberData
    );
    return response.data;
  }

  async getMembers(projectId: number): Promise<ApiResponse<MembersResponse>> {
    const response = await axiosInstance.get<ApiResponse<MembersResponse>>(
      `${this.BASE_PATH}/projects/${projectId}/members`
    );
    return response.data;
  }

  // Task Management
  async createTask(projectId: number, taskData: TaskRequest): Promise<ApiResponse<TaskResponse>> {
    const response = await axiosInstance.post<ApiResponse<TaskResponse>>(
      `${this.BASE_PATH}/projects/${projectId}/tasks`,
      taskData
    );
    return response.data;
  }

  async deleteTask(projectId: number, taskId: number): Promise<ApiResponse<TaskResponse>> {
    const response = await axiosInstance.delete<ApiResponse<TaskResponse>>(
      `${this.BASE_PATH}/projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  }

  async taskStatsByManagerId(): Promise<ApiResponse<taskStats>> {
    const response = await axiosInstance.get<ApiResponse<taskStats>>(
      `${this.BASE_PATH}/projects/tasks/stats`
    )
    return response.data;
  }

  async totalMembersInAllProjects(): Promise<ApiResponse<number>> {
    const response = await axiosInstance.get<ApiResponse<number>>(
      `${this.BASE_PATH}/projects/members`
    )
    return response.data;
  }
}

export default new ManagerService();
