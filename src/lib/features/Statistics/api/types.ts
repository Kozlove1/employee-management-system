import type { BaseFilterParams } from '$lib/api/types'
import type { EmployeeStats } from '$lib/types/shared'
import type { AccrualTypeStats, DepartmentStats, StatisticsSummary } from '../types'
export interface StatisticsSummaryApiResponse {
	summary: StatisticsSummary
}

export interface EmployeeStatsApiResponse {
	employee_stats: EmployeeStats[]
}

export interface AccrualTypeStatsApiResponse {
	accrual_type_stats: AccrualTypeStats[]
}

export interface DepartmentStatsApiResponse {
	department_stats: DepartmentStats[]
}

export interface StatisticsFilterParams extends BaseFilterParams {
	department_guid?: string
	date_period?: 'week' | 'month' | 'quarter' | 'year'
}

export interface CombinedStatisticsResponse {
	summary: StatisticsSummary
	top_employees: EmployeeStats[]
	top_accrual_types: AccrualTypeStats[]
	department_stats: DepartmentStats[]
}
