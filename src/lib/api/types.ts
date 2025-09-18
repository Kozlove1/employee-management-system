import type { BaseApiResponse, BaseApiError, BaseFilterOptions, PaginationOptions } from '$lib/types/shared'

// Реэкспорт общих API типов
export type ApiResponse<T = any> = BaseApiResponse<T>
export type ApiError = BaseApiError
export type PaginationParams = PaginationOptions
export type BaseFilterParams = BaseFilterOptions

export type ErrorHandler = (error: unknown) => void

export interface RequestConfig {
	timeout?: number
	retries?: number
	headers?: Record<string, string>
}
