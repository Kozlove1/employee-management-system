import { getEnvConfig } from '$lib/utils/envUtils'
import type { ApiResponse } from './types'

export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	headers?: Record<string, string>
	body?: any
	timeout?: number
}

export class ApiClient {
	private baseURL: string
	private defaultHeaders: Record<string, string>

	constructor(baseURL?: string) {
		const envConfig = getEnvConfig()
		this.baseURL = baseURL ?? envConfig.apiUrl
		this.defaultHeaders = {
			'Accept': 'application/json'
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestOptions = {}
	): Promise<ApiResponse<T>> {
		const {
			method = 'GET',
			headers = {},
			body,
			timeout = 30000
		} = options

		const url = `${this.baseURL}${endpoint}`
		const requestHeaders = { ...this.defaultHeaders, ...headers }

		// Add Content-Type only for non-FormData requests
		if (!(body instanceof FormData)) {
			requestHeaders['Content-Type'] = 'application/json'
		}

		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), timeout)

		try {
			const response = await fetch(url, {
				method,
				headers: requestHeaders,
				body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
				signal: controller.signal
			})

			clearTimeout(timeoutId)

			const data = await response.json()

			if (!response.ok) {
				return {
					data: {} as T,
					status: 'error',
					message: data.message || `HTTP ${response.status}: ${response.statusText}`
				}
			}

			return {
				data,
				status: 'success',
				message: data.message
			}
		} catch (error) {
			clearTimeout(timeoutId)
			
			if (error instanceof Error) {
				if (error.name === 'AbortError') {
					return {
						data: {} as T,
						status: 'error',
						message: 'Request timeout'
					}
				}
				return {
					data: {} as T,
					status: 'error',
					message: error.message
				}
			}

			return {
				data: {} as T,
				status: 'error',
				message: 'Unknown error occurred'
			}
		}
	}

	async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'GET' })
	}

	async post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'POST', body })
	}

	async put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'PUT', body })
	}

	async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'DELETE' })
	}

	async patch<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
	}

	// Convenience method for FormData uploads
	async upload<T>(endpoint: string, formData: FormData, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: 'POST', body: formData })
	}
}

export const apiClient = new ApiClient()
