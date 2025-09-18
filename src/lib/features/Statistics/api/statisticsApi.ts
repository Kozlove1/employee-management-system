import { apiClient } from '$lib/api/client'
import { API_ENDPOINTS } from '$lib/api/endpoints'

import type {
	AccrualTypeStatsApiResponse,
	CombinedStatisticsResponse,
	DepartmentStatsApiResponse,
	EmployeeStatsApiResponse,
	StatisticsFilterParams,
	StatisticsSummaryApiResponse,
} from './types'

class StatisticsApiService {
	public async getSummary(params?: StatisticsFilterParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString()
			? `${API_ENDPOINTS.STATISTICS.BASE}?${searchParams.toString()}`
			: API_ENDPOINTS.STATISTICS.BASE

		return apiClient.get<StatisticsSummaryApiResponse>(endpoint)
	}

	public async getEmployeeStats(params?: StatisticsFilterParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString()
			? `${API_ENDPOINTS.STATISTICS.EMPLOYEES}?${searchParams.toString()}`
			: API_ENDPOINTS.STATISTICS.EMPLOYEES

		return apiClient.get<EmployeeStatsApiResponse>(endpoint)
	}

	public async getAccrualStats(params?: StatisticsFilterParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString()
			? `${API_ENDPOINTS.STATISTICS.ACCRUALS}?${searchParams.toString()}`
			: API_ENDPOINTS.STATISTICS.ACCRUALS

		return apiClient.get<AccrualTypeStatsApiResponse>(endpoint)
	}

	public async getDepartmentStats(params?: StatisticsFilterParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString()
			? `${API_ENDPOINTS.STATISTICS.DEPARTMENTS}?${searchParams.toString()}`
			: API_ENDPOINTS.STATISTICS.DEPARTMENTS

		return apiClient.get<DepartmentStatsApiResponse>(endpoint)
	}

	public async getCombinedStats(params?: StatisticsFilterParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString()
			? `${API_ENDPOINTS.STATISTICS.BASE}/combined?${searchParams.toString()}`
			: `${API_ENDPOINTS.STATISTICS.BASE}/combined`

		return apiClient.get<CombinedStatisticsResponse>(endpoint)
	}
}

export const statisticsApi = new StatisticsApiService()
