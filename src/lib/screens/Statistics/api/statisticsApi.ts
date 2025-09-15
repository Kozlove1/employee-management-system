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
	// Получить общую статистику
	async getSummary(params?: StatisticsFilterParams) {
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

	// Получить статистику по сотрудникам
	async getEmployeeStats(params?: StatisticsFilterParams) {
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

	// Получить статистику по начислениям
	async getAccrualStats(params?: StatisticsFilterParams) {
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

	// Получить статистику по подразделениям
	async getDepartmentStats(params?: StatisticsFilterParams) {
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

	// Получить объединенную статистику
	async getCombinedStats(params?: StatisticsFilterParams) {
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
