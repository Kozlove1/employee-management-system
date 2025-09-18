import type { BaseFilterParams } from '$lib/api/types'
import type { EmployeeStats } from '$lib/types/shared'
import type { AccrualTypeStats, DepartmentStats, StatisticsSummary } from '../types'
export interface StatisticsSummaryApiResponse {
	summary: StatisticsSummary
}

export interface EmployeeStatsApiResponse {
	employeeStats: EmployeeStats[]
}

export interface AccrualTypeStatsApiResponse {
	accrualTypeStats: AccrualTypeStats[]
}

export interface DepartmentStatsApiResponse {
	departmentStats: DepartmentStats[]
}

export interface StatisticsFilterParams extends BaseFilterParams {
	department_guid?: string
	date_period?: 'week' | 'month' | 'quarter' | 'year'
}

export interface CombinedStatisticsResponse {
	summary: StatisticsSummary
	topEmployees: EmployeeStats[]
	topAccrualTypes: AccrualTypeStats[]
	departmentStats: DepartmentStats[]
}
