import { apiClient } from '$lib/api'
import { API_ENDPOINTS } from '$lib/api/endpoints'

import type {
	AccrualStatisticsRaw,
	EmployeeStatsRaw,
	StatisticsFilterParams,
} from './types'

function buildQuery(params?: StatisticsFilterParams): string {
	if (!params) return ''
	const entries = Object.entries(params).filter(
		([_, v]) => v !== undefined && v !== null && v !== ''
	) as [string, string | number | boolean][]
	if (entries.length === 0) return ''
	const q = new URLSearchParams()
	entries.forEach(([k, v]) => q.set(k, String(v)))
	const s = q.toString()
	return s ? `?${s}` : ''
}

/** Backend: GET /employees/stats — envelope { status, data: EmployeeStatsRaw[] } */
export async function getEmployeeStats(params?: StatisticsFilterParams) {
	return apiClient.get<EmployeeStatsRaw[]>(
		`${API_ENDPOINTS.EMPLOYEES.STATS}${buildQuery(params)}`
	)
}

/** Backend: GET /accruals/stats — envelope { status, data: AccrualStatisticsRaw[] } */
export async function getAccrualStats(params?: StatisticsFilterParams) {
	return apiClient.get<AccrualStatisticsRaw[]>(
		`${API_ENDPOINTS.ACCRUALS.STATS}${buildQuery(params)}`
	)
}

export const statisticsApi = { getEmployeeStats, getAccrualStats }
