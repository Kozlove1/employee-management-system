// Главный экспорт API слоя
export { BaseApiService } from './base/BaseApiService'
export { apiClient, getAxiosInstance, init, instanceOfAxiosError } from './client'
export { API_ENDPOINTS } from './endpoints'
export { apiInstance, initializeApi } from './init'
export type {
    ApiError,
    ApiResponse, BaseFilterParams,
    PaginationParams,
    RequestConfig
} from './types'

export { accrualsApi } from '../features/Accruals/api'
export { employeesApi } from '../features/Employees/api'
export { statisticsApi } from '../features/Statistics/api'
export { accrualTypesApi } from '../features/TypesOfAccruals/api'

