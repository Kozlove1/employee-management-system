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

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface RequestConfig {
	timeout?: number
	retries?: number
	headers?: Record<string, string>
}

export interface BaseFilterParams {
	search?: string
	date_from?: string
	date_to?: string
	active_only?: boolean
}

export interface RequestState {
	isLoading: boolean
	error: string | null
	lastUpdated?: Date
}

export interface ApiConfig {
	baseURL: string
	timeout: number
	retries: number
	headers: Record<string, string>
}
