import { apiClient } from './client'
import type { ApiResponse, BaseFilterParams, PaginationParams } from './types'

export class ApiService {
	protected baseEndpoint: string

	constructor(baseEndpoint: string) {
		this.baseEndpoint = baseEndpoint
	}

	protected async get<T>(
		endpoint: string = '',
		params?: PaginationParams & BaseFilterParams
	): Promise<ApiResponse<T>> {
		const queryParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					queryParams.append(key, String(value))
				}
			})
		}

		const queryString = queryParams.toString()
		const fullEndpoint = `${this.baseEndpoint}${endpoint}${queryString ? `?${queryString}` : ''}`
		
		return apiClient.get<T>(fullEndpoint)
	}

	protected async post<T>(endpoint: string = '', data?: any): Promise<ApiResponse<T>> {
		return apiClient.post<T>(`${this.baseEndpoint}${endpoint}`, data)
	}

	protected async put<T>(endpoint: string = '', data?: any): Promise<ApiResponse<T>> {
		return apiClient.put<T>(`${this.baseEndpoint}${endpoint}`, data)
	}

	protected async delete<T>(endpoint: string = ''): Promise<ApiResponse<T>> {
		return apiClient.delete<T>(`${this.baseEndpoint}${endpoint}`)
	}

	protected async patch<T>(endpoint: string = '', data?: any): Promise<ApiResponse<T>> {
		return apiClient.patch<T>(`${this.baseEndpoint}${endpoint}`, data)
	}
}
