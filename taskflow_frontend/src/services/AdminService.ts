import axiosInstance from "../config/axiosConfig";
import type { RegisterRequest, AuthResponse, ApiResponse } from "../types/api.types";

class AdminService {
  private readonly BASE_PATH = "/api/v1/admin";

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      `${this.BASE_PATH}/register`,
      userData
    );
    return response.data;
  }
}

export default new AdminService();
