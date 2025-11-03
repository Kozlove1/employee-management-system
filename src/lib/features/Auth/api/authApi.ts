import type { ApiResponse } from '$lib/api/types'
import { mockCredentials, mockLoginResponse } from '../mocks/authMockData'
import type { LoginCredentials, LoginResponse } from '../types'

class AuthApiService {
	private useMockData = true

	async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
		if (this.useMockData) {
			await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
			
			if (credentials.email === mockCredentials.email && credentials.password === mockCredentials.password) {
				return {
					status: 'success',
					data: mockLoginResponse,
					message: 'Login successful'
				}
			} else {
				return {
					status: 'error',
					data: mockLoginResponse, // Return mock data structure for consistency
					message: 'Неверный email или пароль'
				}
			}
		}

		// TODO: Implement real API call when backend is ready
		throw new Error('Real API not implemented yet')
	}

	async logout(): Promise<ApiResponse<void>> {
		if (this.useMockData) {
			await new Promise(resolve => setTimeout(resolve, 200))
		return {
			status: 'success',
			data: undefined,
			message: 'Logout successful'
		}
		}

		// TODO: Implement real API call when backend is ready
		throw new Error('Real API not implemented yet')
	}

	async refreshToken(): Promise<ApiResponse<{ token: string }>> {
		if (this.useMockData) {
			await new Promise(resolve => setTimeout(resolve, 200))
			return {
				status: 'success',
				data: { token: 'new-mock-token' },
				message: 'Token refreshed'
			}
		}

		// TODO: Implement real API call when backend is ready
		throw new Error('Real API not implemented yet')
	}

	async getCurrentUser(): Promise<ApiResponse<{ user: LoginResponse['user'], access_token: string }>> {
		if (this.useMockData) {

			await new Promise(resolve => setTimeout(resolve, 200))
			return {
				status: 'success',
				data: { 
					user: mockLoginResponse.user, 
					access_token: mockLoginResponse.token 
				},
				message: 'User data retrieved'
			}
		}

		// TODO: Implement real API call when backend is ready
		throw new Error('Real API not implemented yet')
	}
}

export const authApi = new AuthApiService()
