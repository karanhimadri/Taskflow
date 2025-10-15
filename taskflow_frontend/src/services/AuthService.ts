import axiosInstance from "../config/axiosConfig";
import type { LoginRequest, AuthResponse, ApiResponse } from "../types/api.types";

class AuthService {
  private readonly BASE_PATH = "/api/v1/auth";

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      `${this.BASE_PATH}/login`,
      credentials
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse<object>> {
    const response = await axiosInstance.post<ApiResponse<object>>(
      `${this.BASE_PATH}/logout`
    );
    return response.data;
  }
}

export default new AuthService();
