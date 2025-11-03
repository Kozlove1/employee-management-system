import type { BaseFilterParams, PaginationParams } from '$lib/api/types'
import type { Accrual as AccrualType, AccrualWithDetails as AccrualWithDetailsType } from '../types'

export interface Accrual {
	accrual: AccrualType
}

export interface Accruals {
	accruals: Accrual[]
}

export interface AccrualWithDetails {
	accrual: AccrualWithDetailsType
}

export interface AccrualsWithDetails {
	accruals: AccrualWithDetailsType[]
}

export interface AccrualFilterParams extends BaseFilterParams {
	employee_guid?: string
	type_guid?: string
	department_guid?: string
	amount_min?: number
	amount_max?: number
}

export interface AccrualSearchParams extends PaginationParams, AccrualFilterParams {}

export interface CreateAccrual {
	employee_guid: string
	type_guid: string
	amount: number
	date: string
	comment?: string
}

export interface UpdateAccrual extends Partial<CreateAccrual> {
	accrual_guid: string
}

export interface AccrualStats {
	total_accruals: number
	total_amount: number
	average_amount: number
	monthly_accruals: number
	top_types: Array<{
		type_guid: string
		type_name: string
		count: number
		total_amount: number
	}>
}
