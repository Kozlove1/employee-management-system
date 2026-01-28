import { ApiService } from '$lib/api'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type {
	AccrualTypeApiResponse,
	AccrualTypesListApiResponse,
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
		return this.get<AccrualTypesListApiResponse>('', params)
	}

	public async getById(id: string) {
		return this.get<AccrualTypeApiResponse>(`/${id}`)
	}

	public async create(data: CreateAccrualTypeData) {
		return this.post<AccrualTypeApiResponse>('', data)
	}

	public async update(id: string, data: UpdateAccrualTypeData) {
		return this.put<AccrualTypeApiResponse>(`/${id}`, data)
	}

	public async deleteType(id: string) {
		return this.delete(`/${id}`)
	}

	public async getStats() {
		return this.get<{ stats: AccrualTypeStats }>('/stats')
	}
}

export const accrualTypesApi = new AccrualTypesApiService()
