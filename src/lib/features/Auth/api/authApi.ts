import { apiClient } from "$lib/api/client";
import { API_ENDPOINTS } from "$lib/api/endpoints";
import type { ApiResponse } from "$lib/api/types";
import type { LoginCredentials, LoginResponse } from "../types";

class AuthApiService {
	async login(
		credentials: LoginCredentials,
	): Promise<ApiResponse<LoginResponse>> {
		return apiClient.post<LoginResponse>(
			API_ENDPOINTS.AUTH.LOGIN,
			{
				email: credentials.email,
				password: credentials.password,
			},
			{ skipAuth: true },
		);
	}

	async logout(): Promise<ApiResponse<void>> {
		return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
	}

	async refreshToken(): Promise<ApiResponse<{ token: string }>> {
		return apiClient.post<{ token: string }>(
			API_ENDPOINTS.AUTH.REFRESH,
			undefined,
			{
				skipAuth: true,
			},
		);
	}

	async getCurrentUser(): Promise<ApiResponse<LoginResponse["user"]>> {
		return apiClient.get<LoginResponse["user"]>(API_ENDPOINTS.AUTH.ME);
	}
}

export const authApi = new AuthApiService();
