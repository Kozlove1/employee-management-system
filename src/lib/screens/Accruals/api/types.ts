import type { BaseFilterParams, PaginationParams } from '$lib/api/types'
import type { Accrual, AccrualWithDetails } from '../types'

// API типы для начислений
export interface AccrualApiResponse {
	accrual: Accrual
}

export interface AccrualsApiResponse {
	accruals: Accrual[]
}

export interface AccrualWithDetailsApiResponse {
	accrual: AccrualWithDetails
}

export interface AccrualsWithDetailsApiResponse {
	accruals: AccrualWithDetails[]
}

// Параметры для запросов
export interface AccrualFilterParams extends BaseFilterParams {
	employee_guid?: string
	type_guid?: string
	department_guid?: string
	amount_min?: number
	amount_max?: number
}

export interface AccrualSearchParams extends PaginationParams, AccrualFilterParams {}

// Типы для создания/обновления
export interface CreateAccrualData {
	employee_guid: string
	type_guid: string
	amount: number
	date: string
	comment?: string
}

export interface UpdateAccrualData extends Partial<CreateAccrualData> {
	accrual_guid: string
}

// Статистика по начислениям
export interface AccrualStats {
	totalAccruals: number
	totalAmount: number
	averageAmount: number
	monthlyAccruals: number
	topTypes: Array<{
		type_guid: string
		type_name: string
		count: number
		total_amount: number
	}>
}
