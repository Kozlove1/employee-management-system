import type { BaseFilterParams, PaginationParams } from "$lib/api/types";
import type { AccrualType } from "$lib/types/shared";

// Формат BaseEntityResponse для одного типа начисления
export interface AccrualTypeApiResponse {
	accrualType: AccrualType;
}

// Формат BaseListResponse для списка типов начислений
// Реальный формат API: { list: AccrualTypeFromApi[], page, total_page, total }
export interface AccrualTypesListApiResponse {
	list: AccrualTypeFromApi[];
	page: number;
	total_page: number;
	total: number;
}

// API возвращает объекты с полем 'id' вместо 'type_guid'
export interface AccrualTypeFromApi extends Omit<AccrualType, "type_guid"> {
	id: string;
}

// Параметры поиска для GET /accrual-types
export interface AccrualTypeSearchParams extends PaginationParams, BaseFilterParams {
	// Все параметры из PaginationParams: page, limit, sort, order
	// Все параметры из BaseFilterParams: search, date_from, date_to, active_only
	// Параметр search используется для поиска по type_name согласно спецификации API
	// API принимает любые поля AccrualType в качестве query параметров
	ammo_coins_amount?: number; // Фильтр по значению ammo_coins_amount (точное совпадение для переменных типов: = 0)
}

// Тело запроса для POST /accrual-types
export interface CreateAccrualTypeData {
	type_name: string;
	ammo_coins_amount?: number;
	org_guid?: string;
	date_create?: string;
	// Согласно спецификации API, модель AccrualType может включать другие поля
	// но в спецификации упоминаются только type_name и ammo_coins_amount
}

// Тело запроса для PUT /accrual-types/{id}
export interface UpdateAccrualTypeData {
	type_name?: string;
	ammo_coins_amount?: number;
	// id передается в пути URL, а не в теле запроса
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
