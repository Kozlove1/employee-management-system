import { apiClient } from '$lib/api/client'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type {
    AccrualTypeApiResponse,
    AccrualTypesApiResponse,
    AccrualTypeSearchParams,
    AccrualTypeStats,
    CreateAccrualTypeData,
    UpdateAccrualTypeData,
} from './types'

class AccrualTypesApiService {
	// Получить все типы начислений
	async getAll(params?: AccrualTypeSearchParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString() 
			? `${API_ENDPOINTS.ACCRUAL_TYPES.BASE}?${searchParams.toString()}`
			: API_ENDPOINTS.ACCRUAL_TYPES.BASE

		return apiClient.get<AccrualTypesApiResponse>(endpoint)
	}

	// Получить тип начисления по ID
	async getById(typeGuid: string) {
		return apiClient.get<AccrualTypeApiResponse>(
			API_ENDPOINTS.ACCRUAL_TYPES.BY_ID(typeGuid)
		)
	}

	// Создать тип начисления
	async create(data: CreateAccrualTypeData) {
		return apiClient.post<AccrualTypeApiResponse>(
			API_ENDPOINTS.ACCRUAL_TYPES.BASE,
			data
		)
	}

	// Обновить тип начисления
	async update(data: UpdateAccrualTypeData) {
		return apiClient.put<AccrualTypeApiResponse>(
			API_ENDPOINTS.ACCRUAL_TYPES.BY_ID(data.type_guid),
			data
		)
	}

	// Удалить тип начисления
	async delete(typeGuid: string) {
		return apiClient.delete(API_ENDPOINTS.ACCRUAL_TYPES.BY_ID(typeGuid))
	}

	// Получить статистику по типам начислений
	async getStats() {
		return apiClient.get<{ stats: AccrualTypeStats }>(API_ENDPOINTS.ACCRUAL_TYPES.STATS)
	}
}

export const accrualTypesApi = new AccrualTypesApiService()
