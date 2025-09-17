import { BaseApiService } from '$lib/api/base/BaseApiService'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type { PaginationParams } from '../../../api'
import type {
	Accrual,
	AccrualSearchParams,
	AccrualStats,
	AccrualsWithDetails,
	AccrualWithDetails,
	CreateAccrual,
	UpdateAccrual
} from './types'

class AccrualsApiService extends BaseApiService {
	public async getAll(params?: AccrualSearchParams) {
		return this.get<AccrualsWithDetails>(API_ENDPOINTS.ACCRUALS.BASE, params)
	}

	public async getById(accrualGuid: string) {
		return this.get<AccrualWithDetails>(API_ENDPOINTS.ACCRUALS.BY_ID(accrualGuid))
	}

	public async getByEmployee(employeeGuid: string, params?: PaginationParams) {
		return this.get<AccrualsWithDetails>(
			API_ENDPOINTS.ACCRUALS.BY_EMPLOYEE(employeeGuid), 
			params
		)
	}

	public async create(data: CreateAccrual) {
		return this.post<Accrual>(API_ENDPOINTS.ACCRUALS.BASE, data)
	}

	public async update(data: UpdateAccrual) {
		return this.put<Accrual>(API_ENDPOINTS.ACCRUALS.BY_ID(data.accrual_guid), data)
	}

	public async deleteAccrual(accrualGuid: string) {
		return this.delete(API_ENDPOINTS.ACCRUALS.BY_ID(accrualGuid))
	}

	public async getStats() {
		return this.get<{ stats: AccrualStats }>(API_ENDPOINTS.ACCRUALS.STATS)
	}
}

export const accrualsApi = new AccrualsApiService()
