import type { BaseFilterParams, PaginationParams } from "$lib/api/types";
import type { AccrualType } from "$lib/types/shared";

export interface AccrualTypeApiResponse {
	accrualType: AccrualType;
}

// API returns objects with 'id' field instead of 'type_guid'
export interface AccrualTypeFromApi extends Omit<AccrualType, "type_guid"> {
	id: string;
}

// API returns array directly in data field
export type AccrualTypesApiResponse = AccrualTypeFromApi[];

export interface AccrualTypeFilterParams extends BaseFilterParams {
	has_fixed_amount?: boolean;
	ammo_coins_min?: number;
	ammo_coins_max?: number;
}

export interface AccrualTypeSearchParams
	extends PaginationParams,
		AccrualTypeFilterParams {}

export interface CreateAccrualTypeData {
	type_name: string;
	ammo_coins_amount?: number;
	org_guid: string;
	date_create: string;
	date_delete: string;
	id: string;
}

export interface UpdateAccrualTypeData extends Partial<CreateAccrualTypeData> {
	type_guid: string;
}

export interface AccrualTypeStats {
	total_types: number;
	types_with_fixed_amount: number;
	types_with_variable_amount: number;
	most_used_types: Array<{
		type_guid: string;
		type_name: string;
		usage_count: number;
		total_amount: number;
	}>;
}
