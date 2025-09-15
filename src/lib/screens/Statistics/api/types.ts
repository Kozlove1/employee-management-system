import type { BaseFilterParams } from '$lib/api/types'
import type { EmployeeStats } from '$lib/screens/Employees/types'
import type { AccrualTypeStats, DepartmentStats, StatisticsSummary } from '../types'

// API типы для статистики
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

// Параметры для запросов статистики
export interface StatisticsFilterParams extends BaseFilterParams {
	department_guid?: string
	date_period?: 'week' | 'month' | 'quarter' | 'year'
}

// Объединенная статистика
export interface CombinedStatisticsResponse {
	summary: StatisticsSummary
	topEmployees: EmployeeStats[]
	topAccrualTypes: AccrualTypeStats[]
	departmentStats: DepartmentStats[]
}
