// Главный экспорт API слоя
export { apiClient, getAxiosInstance, init, instanceOfAxiosError } from './client'
export { API_ENDPOINTS } from './endpoints'
export { apiInstance, initializeApi } from './init'
export type {
    ApiConfig, ApiError,
    ApiResponse, BaseFilterParams, PaginatedResponse,
    PaginationParams,
    RequestConfig,
    RequestState
} from './types'

export { accrualsApi } from '../screens/Accruals/api'
export { employeesApi } from '../screens/Employees/api'
export { statisticsApi } from '../screens/Statistics/api'
export { accrualTypesApi } from '../screens/TypesOfAccruals/api'

