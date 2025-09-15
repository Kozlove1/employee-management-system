import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'
import type { ApiResponse, RequestConfig } from './types'

export type ErrorHandler = (error: unknown) => void

const NETWORK_AWAIT_TIMEOUT = 5000

type CustomRequestConfig = RequestConfig & {
	axiosInstance?: AxiosInstance
	enableAuth?: boolean
}

let instance: AxiosInstance | null = null
let errorHandlerInstance: ErrorHandler | null = null
let fetchTokenOverrideFn: (() => string) | null = null

export let BASE_URLS = {
	API: '',
}

const debugLog = (...args: any[]) => {
		console.log(...args)
}

export const getAuthToken = async (): Promise<string> => {
	if (fetchTokenOverrideFn) {
		return fetchTokenOverrideFn()
	}

	// Используем AuthService для получения токена
	const { authService } = await import('./auth')
	return authService.getAuthToken()
}

export const getAuthenticatedUser = async (): Promise<any> => {
	// Используем AuthService для получения пользователя
	const { authService } = await import('./auth')
	return authService.getCurrentUser()
}

type InitParams = {
	urls: typeof BASE_URLS
	axiosConfig?: Omit<AxiosRequestConfig, 'baseURL'>
	fetchTokenOverride?: () => string
	errorHandler?: ErrorHandler
}

export function init({ urls, axiosConfig, fetchTokenOverride, errorHandler }: InitParams) {
	instance = axios.create({ baseURL: urls.API, ...axiosConfig })

	debugLog('Initialized API with:', JSON.stringify(urls, null, 2))

	BASE_URLS = urls
	if (fetchTokenOverride !== undefined) {
		fetchTokenOverrideFn = fetchTokenOverride
	}
	if (errorHandler !== undefined) {
		errorHandlerInstance = errorHandler
	}
	return instance
}

export function instanceOfAxiosError(error: unknown): error is AxiosError {
	return !!error && typeof error === 'object' && 'name' in error && error.name === 'AxiosError'
}

export function getAxiosInstance(): AxiosInstance {
	if (!instance) throw new Error('Api must be initialized with init() function first')
	return instance
}

const createAuthorizationHeader = async (config?: Pick<CustomRequestConfig, 'enableAuth'>) => {
	const Authorization = config?.enableAuth ? await getAuthToken() : null
	return Authorization ? { Authorization } : {}
}

class ApiClient {
	private baseURL: string
	private defaultConfig: RequestConfig

	constructor(baseURL: string = '/api', config: RequestConfig = {}) {
		this.baseURL = baseURL
		this.defaultConfig = {
			timeout: 10000,
			retries: 3,
			headers: {
				'Content-Type': 'application/json',
			},
			...config,
		}
	}

	private async makeRequest<T>(
		endpoint: string,
		options: RequestInit = {},
		config: CustomRequestConfig = {}
	): Promise<ApiResponse<T>> {
		const finalConfig = { ...this.defaultConfig, ...config }

		try {
			const { enableAuth, axiosInstance, ...axiosConfig } = config
			const instance = axiosInstance || getAxiosInstance()
			const headers = {
				...finalConfig.headers,
				...(await createAuthorizationHeader({ enableAuth: enableAuth ?? true })),
			}

			const response = await instance({
				headers,
				url: endpoint,
				method: options.method?.toLowerCase() as any,
				data: options.body,
				...axiosConfig,
			})

			return {
				data: response.data,
				status: 'success',
			}
		} catch (error) {
			return await this.handleApiError({
				error,
				attempt: 1,
				retry: () => this.makeRequest<T>(endpoint, options, config),
				info: { endpoint: `${options.method || 'GET'} ${endpoint}`, params: config },
			})
		}
	}

	private async handleApiError({ error, attempt, retry, info }: {
		error: unknown
		attempt: number
		retry: () => Promise<ApiResponse<any>>
		info: Record<string, unknown>
	}): Promise<never> {
		if (axios.isCancel(error)) {
			throw new ApiError('Request cancelled', 'CANCELLED', error)
		}

		debugLog('Handle API Error:', error, JSON.stringify(info, null, 2))

		if (instanceOfAxiosError(error)) {
			debugLog('Error code:', error.code, ' status:', error.status)

			const handleUnauthenticated = async () => {
				debugLog('Unauthenticated error, trying to refresh token, attempt:', attempt)
				await getAuthToken()
				await this.awaitTimeout(NETWORK_AWAIT_TIMEOUT)
				const result = await retry()
				throw result
			}

			switch (error.code) {
				case 'ERR_NETWORK':
					await this.awaitTimeout(NETWORK_AWAIT_TIMEOUT)
					const networkResult = await retry()
					throw networkResult
				case 'ERR_BAD_REQUEST':
					if (error.status === 401) {
						await handleUnauthenticated()
					}
					break
				case '401':
					await handleUnauthenticated()
			}

			const dataResponse = error.response ? error.response.data : error.response
			const errorFromResponse = new ApiError(
				typeof dataResponse === 'string' ? dataResponse : error.message,
				error.status,
				dataResponse
			)

			errorHandlerInstance?.(errorFromResponse)
			throw errorFromResponse
		}

		errorHandlerInstance?.(error)
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
		throw new ApiError(errorMessage, 'NETWORK_ERROR', error)
	}

	private awaitTimeout = (v = 0) =>
		new Promise((res) => {
			if (!v) {
				res(true)
				return
			}
			setTimeout(res, v)
		})

	async get<T>(endpoint: string, config?: CustomRequestConfig): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(endpoint, { method: 'GET' }, config)
	}

	async post<T>(
		endpoint: string,
		data?: any,
		config?: CustomRequestConfig
	): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(
			endpoint,
			{
				method: 'POST',
				body: data ? JSON.stringify(data) : undefined,
			},
			config
		)
	}

	async put<T>(
		endpoint: string,
		data?: any,
		config?: CustomRequestConfig
	): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(
			endpoint,
			{
				method: 'PUT',
				body: data ? JSON.stringify(data) : undefined,
			},
			config
		)
	}

	async delete<T>(endpoint: string, config?: CustomRequestConfig): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(endpoint, { method: 'DELETE' }, config)
	}

	async patch<T>(
		endpoint: string,
		data?: any,
		config?: CustomRequestConfig
	): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(
			endpoint,
			{
				method: 'PATCH',
				body: data ? JSON.stringify(data) : undefined,
			},
			config
		)
	}
}

// Кастомный класс ошибки
class ApiError extends Error {
	constructor(
		message: string,
		public code?: string | number,
		public details?: any
	) {
		super(message)
		this.name = 'ApiError'
	}
}

// Создаем экземпляр клиента
export const apiClient = new ApiClient()
export type { ApiError }
