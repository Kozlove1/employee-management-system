import { apiClient } from '$lib/api/client'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type {
    AccrualApiResponse,
    AccrualSearchParams,
    AccrualStats,
    AccrualsWithDetailsApiResponse,
    AccrualWithDetailsApiResponse,
    CreateAccrualData,
    UpdateAccrualData
} from './types'

class AccrualsApiService {
	// Получить все начисления
	async getAll(params?: AccrualSearchParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString() 
			? `${API_ENDPOINTS.ACCRUALS.BASE}?${searchParams.toString()}`
			: API_ENDPOINTS.ACCRUALS.BASE

		return apiClient.get<AccrualsWithDetailsApiResponse>(endpoint)
	}

	// Получить начисление по ID
	async getById(accrualGuid: string) {
		return apiClient.get<AccrualWithDetailsApiResponse>(
			API_ENDPOINTS.ACCRUALS.BY_ID(accrualGuid)
		)
	}

	// Получить начисления по сотруднику
	async getByEmployee(employeeGuid: string, params?: PaginationParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString()
			? `${API_ENDPOINTS.ACCRUALS.BY_EMPLOYEE(employeeGuid)}?${searchParams.toString()}`
			: API_ENDPOINTS.ACCRUALS.BY_EMPLOYEE(employeeGuid)

		return apiClient.get<AccrualsWithDetailsApiResponse>(endpoint)
	}

	// Создать начисление
	async create(data: CreateAccrualData) {
		return apiClient.post<AccrualApiResponse>(
			API_ENDPOINTS.ACCRUALS.BASE,
			data
		)
	}

	// Обновить начисление
	async update(data: UpdateAccrualData) {
		return apiClient.put<AccrualApiResponse>(
			API_ENDPOINTS.ACCRUALS.BY_ID(data.accrual_guid),
			data
		)
	}

	// Удалить начисление
	async delete(accrualGuid: string) {
		return apiClient.delete(API_ENDPOINTS.ACCRUALS.BY_ID(accrualGuid))
	}

	// Получить статистику по начислениям
	async getStats() {
		return apiClient.get<{ stats: AccrualStats }>(API_ENDPOINTS.ACCRUALS.STATS)
	}
}

export const accrualsApi = new AccrualsApiService()
