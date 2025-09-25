import { ApiService } from '$lib/api'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type { PaginationParams } from '$lib/api/types'
import type {
    Accrual,
    AccrualSearchParams,
    AccrualStats,
    AccrualsWithDetails,
    AccrualWithDetails,
    CreateAccrual,
    UpdateAccrual
} from './types'

class AccrualsApiService extends ApiService {
	constructor() {
		super(API_ENDPOINTS.ACCRUALS.BASE)
	}
	public async getAll(params?: AccrualSearchParams) {
		return this.get<AccrualsWithDetails>('', params)
	}

	public async getById(accrualGuid: string) {
		return this.get<AccrualWithDetails>(`/${accrualGuid}`)
	}

	public async getByEmployee(employeeGuid: string, params?: PaginationParams) {
		return this.get<AccrualsWithDetails>(`/employee/${employeeGuid}`, params)
	}

	public async create(data: CreateAccrual) {
		return this.post<Accrual>('', data)
	}

	public async update(data: UpdateAccrual) {
		return this.put<Accrual>(`/${data.accrual_guid}`, data)
	}

	public async deleteAccrual(accrualGuid: string) {
		return this.delete(`/${accrualGuid}`)
	}

	public async getStats() {
		return this.get<{ stats: AccrualStats }>('/stats')
	}
}

export const accrualsApi = new AccrualsApiService()
