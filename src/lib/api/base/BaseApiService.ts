import { apiClient } from '../client'
import type { ApiResponse, RequestConfig } from '../types'

export abstract class BaseApiService {
	protected buildUrlWithParams(baseUrl: string, params?: Record<string, any>): string {
		if (!params) return baseUrl
		
		const searchParams = new URLSearchParams()
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				searchParams.append(key, String(value))
			}
		})
		
		const queryString = searchParams.toString()
		return queryString ? `${baseUrl}?${queryString}` : baseUrl
	}

	protected async get<T>(
		endpoint: string, 
		params?: Record<string, any>, 
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		const url = this.buildUrlWithParams(endpoint, params)
		return apiClient.get<T>(url, config)
	}

	protected async post<T>(
		endpoint: string, 
		data?: any, 
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		return apiClient.post<T>(endpoint, data, config)
	}

	protected async put<T>(
		endpoint: string, 
		data?: any, 
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		return apiClient.put<T>(endpoint, data, config)
	}

	protected async patch<T>(
		endpoint: string, 
		data?: any, 
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		return apiClient.patch<T>(endpoint, data, config)
	}

	protected async delete<T>(
		endpoint: string, 
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		return apiClient.delete<T>(endpoint, config)
	}
}
