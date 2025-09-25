import { ApiService } from '$lib/api'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type {
	AccrualTypeApiResponse,
	AccrualTypesApiResponse,
	AccrualTypeSearchParams,
	AccrualTypeStats,
	CreateAccrualTypeData,
	UpdateAccrualTypeData,
} from './types'

class AccrualTypesApiService extends ApiService {
	constructor() {
		super(API_ENDPOINTS.ACCRUAL_TYPES.BASE)
	}
	public async getAll(params?: AccrualTypeSearchParams) {
		return this.get<AccrualTypesApiResponse>('', params)
	}

	public async getById(typeGuid: string) {
		return this.get<AccrualTypeApiResponse>(`/${typeGuid}`)
	}

	public async create(data: CreateAccrualTypeData) {
		return this.post<AccrualTypeApiResponse>('', data)
	}

	public async update(data: UpdateAccrualTypeData) {
		return this.put<AccrualTypeApiResponse>(`/${data.type_guid}`, data)
	}

	public async deleteType(typeGuid: string) {
		return this.delete(`/${typeGuid}`)
	}

	public async getStats() {
		return this.get<{ stats: AccrualTypeStats }>('/stats')
	}
}

export const accrualTypesApi = new AccrualTypesApiService()
