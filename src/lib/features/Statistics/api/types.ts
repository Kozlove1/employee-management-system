import type { BaseFilterParams } from '$lib/api/types'
import type { EmployeeStats } from '$lib/types/shared'
import type { AccrualTypeStats } from '../types'

/** Backend: GET /accruals/stats — элемент массива data */
export interface AccrualStatisticsRaw {
	accrual_type: {
		id: string
		type_name: string
		ammo_coins_amount?: number
		org_guid: string
		date_create?: string
		date_delete?: string
	}
	count_accruals: number
	count_employees: number
	total_amount: number
}

/** Backend: GET /employees/stats — элемент массива data (модель Employee с balance) */
export interface EmployeeStatsRaw {
	id: string
	employee: string
	ident?: string
	balance?: number
	department?: { department?: string }
	department_guid?: string
	email?: string
	org_guid?: string
	person_guid?: string
	post_guid?: string
	sex?: string
	date_create?: string
	date_delete?: string
}

export interface StatisticsFilterParams extends BaseFilterParams {
	department_guid?: string
	date_period?: 'week' | 'month' | 'quarter' | 'year'
	date_from?: string
	date_to?: string
	limit?: number
}

export function mapEmployeeStatsRaw(raw: EmployeeStatsRaw): EmployeeStats {
	return {
		employee_guid: raw.id,
		employee_name: raw.employee ?? '',
		ident: raw.ident ?? '',
		total_balance: raw.balance ?? 0,
		department_name: raw.department?.department ?? '',
	}
}

export function mapAccrualStatisticsRaw(raw: AccrualStatisticsRaw): AccrualTypeStats {
	const count = raw.count_accruals || 1
	const fixed = raw.accrual_type?.ammo_coins_amount != null && raw.accrual_type.ammo_coins_amount > 0
	return {
		type_guid: raw.accrual_type?.id ?? '',
		type_name: raw.accrual_type?.type_name ?? '',
		category: '—',
		total_count: raw.count_accruals,
		unique_employees: raw.count_employees,
		total_amount: raw.total_amount,
		average_amount: count > 0 ? raw.total_amount / count : 0,
		has_fixed_amount: fixed,
	}
}
