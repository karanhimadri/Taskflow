import axiosInstance from "../config/axiosConfig";
import type { AuthResponse, ApiResponse } from "../types/api.types";

class UserService {
  private readonly BASE_PATH = "/api/v1/users";

  async getUserDetails(): Promise<ApiResponse<AuthResponse>> {
    const response = await axiosInstance.get<ApiResponse<AuthResponse>>(
      `${this.BASE_PATH}/me`
    );
    return response.data;
  }

  async searchAvailableMembers(projectId: number, query: string): Promise<ApiResponse<AuthResponse[]>> {
    const encodedQuery = encodeURIComponent(query);
    const response = await axiosInstance.get<ApiResponse<AuthResponse[]>>(
      `${this.BASE_PATH}/projects/${projectId}/available-members?query=${encodedQuery}`
    )
    return response.data;
  }

  async findAvailableMembersForTaskByProjectId(projectId: number): Promise<ApiResponse<AuthResponse[]>> {
    const response = await axiosInstance.get<ApiResponse<AuthResponse[]>>(
      `${this.BASE_PATH}/projects/${projectId}/tasks/available-members`
    )
    return response.data;
  }
}

export default new UserService();
