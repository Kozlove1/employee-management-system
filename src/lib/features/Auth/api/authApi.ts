import type { ApiResponse } from '$lib/api/types'
import { apiClient } from '../../../api'
import type { LoginCredentials, LoginResponse } from '../types'

class AuthApiService {
	private useMockData = true // Set to false for production API

	async login(credentials: LoginCredentials): Promise<ApiResponse<{ data: LoginResponse }>> {
		if (this.useMockData) {
			// Use mock server-side API for secure cookie handling
			return apiClient.post<{ data: LoginResponse }>('/mocks/auth/login', credentials)
		}

		return apiClient.post<{ data: LoginResponse }>('/auth/login', credentials)
	}

	async logout(): Promise<ApiResponse<void>> {
		if (this.useMockData) {
			// Use mock server-side API for secure cookie clearing
			return apiClient.post<void>('/mocks/auth/logout')
		}

		return apiClient.post<void>('/auth/logout')
	}

	async refreshToken(): Promise<ApiResponse<{ token: string }>> {
		if (this.useMockData) {
			// Use mock server-side API for secure refresh token handling
			return apiClient.post<{ token: string }>('/mocks/auth/refresh')
		}

		return apiClient.post<{ token: string }>('/auth/refresh')
	}

	async getCurrentUser(): Promise<ApiResponse<{ user: LoginResponse['user'], accessToken: string }>> {
		if (this.useMockData) {
			// Use mock server-side API for secure user data retrieval
			return apiClient.get<{ user: LoginResponse['user'], accessToken: string }>('/mocks/auth/me')
		}

		return apiClient.get<{ user: LoginResponse['user'], accessToken: string }>('/auth/me')
	}
}

export const authApi = new AuthApiService()
