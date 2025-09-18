export interface ApiResponse<T = any> {
	data: T
	message?: string
	status: 'success' | 'error'
}

export interface ApiError {
	message: string
	code?: string | number
	details?: any
}

export interface PaginationParams {
	page?: number
	limit?: number
	sort?: string
	order?: 'asc' | 'desc'
}

export interface BaseFilterParams {
	search?: string
	date_from?: string
	date_to?: string
	active_only?: boolean
}

export type ErrorHandler = (error: unknown) => void

export interface RequestConfig {
	timeout?: number
	retries?: number
	headers?: Record<string, string>
}
