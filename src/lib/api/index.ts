// Главный экспорт API слоя
export { authService, getAuthToken, getAuthenticatedUser } from './auth'
export { ApiError, apiClient, getAxiosInstance, init, instanceOfAxiosError } from './client'
export { API_ENDPOINTS } from './endpoints'
export { apiInstance, initializeApi } from './init'
export type {
    ApiConfig, ApiError as ApiErrorType,
    ApiResponse, AuthToken, AuthUser, BaseFilterParams, ErrorHandler, PaginatedResponse,
    PaginationParams,
    RequestConfig,
    RequestState
} from './types'

// Экспорт модульных API сервисов
export * from '../screens/Accruals/api'
export * from '../screens/Employees/api'
export * from '../screens/Statistics/api'
export * from '../screens/TypesOfAccruals/api'

