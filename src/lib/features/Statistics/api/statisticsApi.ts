import { ApiService } from '$lib/api'
import { API_ENDPOINTS } from '$lib/api/endpoints'

import type {
    AccrualTypeStatsApiResponse,
    CombinedStatisticsResponse,
    DepartmentStatsApiResponse,
    EmployeeStatsApiResponse,
    StatisticsFilterParams,
    StatisticsSummaryApiResponse,
} from './types'

class StatisticsApiService extends ApiService {
	constructor() {
		super(API_ENDPOINTS.STATISTICS.BASE)
	}
	public async getSummary(params?: StatisticsFilterParams) {
		return this.get<StatisticsSummaryApiResponse>('', params)
	}

	public async getEmployeeStats(params?: StatisticsFilterParams) {
		return this.get<EmployeeStatsApiResponse>('/employees', params)
	}

	public async getAccrualStats(params?: StatisticsFilterParams) {
		return this.get<AccrualTypeStatsApiResponse>('/accruals', params)
	}

	public async getDepartmentStats(params?: StatisticsFilterParams) {
		return this.get<DepartmentStatsApiResponse>('/departments', params)
	}

	public async getCombinedStats(params?: StatisticsFilterParams) {
		return this.get<CombinedStatisticsResponse>('/combined', params)
	}
}

export const statisticsApi = new StatisticsApiService()
