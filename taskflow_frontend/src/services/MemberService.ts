import axiosInstance from "../config/axiosConfig";
import type { TaskResponse, ApiResponse } from "../types/api.types";

class MemberService {
  private readonly BASE_PATH = "/api/v1/members";

  async getMyTasks(): Promise<ApiResponse<TaskResponse[]>> {
    const response = await axiosInstance.get<ApiResponse<TaskResponse[]>>(
      `${this.BASE_PATH}/tasks/my`
    );
    return response.data;
  }

  async updateTaskStatus(taskId: number, status: string): Promise<ApiResponse<TaskResponse>> {
    const response = await axiosInstance.patch<ApiResponse<TaskResponse>>(
      `${this.BASE_PATH}/tasks/${taskId}/status?status=${status}`
    );
    return response.data;
  }

  async updateTaskPriority(taskId: number, priority: string): Promise<ApiResponse<TaskResponse>> {
    const response = await axiosInstance.patch<ApiResponse<TaskResponse>>(
      `${this.BASE_PATH}/tasks/${taskId}/priority?priority=${priority}`
    );
    return response.data;
  }
}

export default new MemberService();
