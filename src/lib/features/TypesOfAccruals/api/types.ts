import type { BaseFilterParams, PaginationParams } from '$lib/api/types'
import type { AccrualType } from '$lib/types/shared'

export interface AccrualTypeApiResponse {
	accrualType: AccrualType
}

export interface AccrualTypesApiResponse {
	accrualTypes: AccrualType[]
}

export interface AccrualTypeFilterParams extends BaseFilterParams {
	has_fixed_amount?: boolean
	ammo_coins_min?: number
	ammo_coins_max?: number
}

export interface AccrualTypeSearchParams extends PaginationParams, AccrualTypeFilterParams {}

export interface CreateAccrualTypeData {
	type_name: string
	ammo_coins_amount?: number
}

export interface UpdateAccrualTypeData extends Partial<CreateAccrualTypeData> {
	type_guid: string
}

export interface AccrualTypeStats {
	totalTypes: number
	typesWithFixedAmount: number
	typesWithVariableAmount: number
	mostUsedTypes: Array<{
		type_guid: string
		type_name: string
		usage_count: number
		total_amount: number
	}>
}
