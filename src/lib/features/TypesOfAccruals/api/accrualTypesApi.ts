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
	public async getAll(params?: AccrualTypeSearchParams) {
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

	public async getById(typeGuid: string) {
		return apiClient.get<AccrualTypeApiResponse>(
			API_ENDPOINTS.ACCRUAL_TYPES.BY_ID(typeGuid)
		)
	}

	public async create(data: CreateAccrualTypeData) {
		return apiClient.post<AccrualTypeApiResponse>(
			API_ENDPOINTS.ACCRUAL_TYPES.BASE,
			data
		)
	}

	public async update(data: UpdateAccrualTypeData) {
		return apiClient.put<AccrualTypeApiResponse>(
			API_ENDPOINTS.ACCRUAL_TYPES.BY_ID(data.type_guid),
			data
		)
	}

	public async delete(typeGuid: string) {
		return apiClient.delete(API_ENDPOINTS.ACCRUAL_TYPES.BY_ID(typeGuid))
	}

	public async getStats() {
		return apiClient.get<{ stats: AccrualTypeStats }>(API_ENDPOINTS.ACCRUAL_TYPES.STATS)
	}
}

export const accrualTypesApi = new AccrualTypesApiService()
