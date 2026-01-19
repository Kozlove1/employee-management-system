import type { BaseFilterParams, PaginationParams } from "$lib/api/types";
import type {
	Accrual as AccrualType,
	AccrualWithDetails as AccrualWithDetailsType,
} from "../types";

// Тип начисления, возвращаемый API (может содержать вложенные объекты)
export interface ApiAccrualType {
	id?: string;
	type_guid?: string;
	type_name?: string;
	org_guid?: string;
	ammo_coins_amount?: number;
	date_create?: string;
	date_delete?: string;
}

// Сотрудник, возвращаемый API в составе начисления (может содержать вложенные объекты)
export interface ApiAccrualEmployee {
	id?: string;
	employee_guid?: string;
	employee?: string;
	ident?: string;
	email?: string;
	sex?: string;
	person_guid?: string;
	org_guid?: string;
	post_guid?: string;
	department_guid?: string;
	department_name?: string;
	post?: string;
	position_name?: string;
	balance?: number;
	date_create?: string;
	date_delete?: string;
}

// Элемент начисления, возвращаемый API
// Может содержать вложенные объекты type и employee
export interface ApiAccrualItem {
	id?: string;
	accrual_guid?: string;
	org_guid?: string;
	employee_guid?: string;
	type_guid?: string;
	department_guid?: string;
	post_guid?: string;
	amount?: number;
	date?: string;
	comment?: string;
	date_create?: string;
	date_delete?: string;
	post?: string;
	position_name?: string;
	department_name?: string;
	type?: ApiAccrualType;
	employee?: ApiAccrualEmployee;
}

// Формат BaseEntityResponse для одного начисления
export interface Accrual {
	accrual: AccrualType;
}

// Массив начислений
export type Accruals = AccrualType[];

// Формат BaseEntityResponse для одного начисления с деталями
export interface AccrualWithDetails {
	accrual: AccrualWithDetailsType;
}

// Формат BaseListResponse для списка начислений
export interface AccrualsWithDetails {
	list: ApiAccrualItem[];
	page: number;
	total_page: number;
	total: number;
}

// Параметры фильтрации для начислений
export interface AccrualFilterParams extends BaseFilterParams {
	employee_guid?: string;
	type_guid?: string;
	department_guid?: string;
	amount_min?: number;
	amount_max?: number;
}

// Параметры поиска для GET /accruals
export interface AccrualSearchParams
	extends PaginationParams,
		AccrualFilterParams {}

// Тело запроса для POST /accruals
export interface CreateAccrual {
	employee_guid: string;
	type_guid: string;
	amount: number;
	date: string;
	comment: string;
	org_guid: string;
	department_guid: string;
	post_guid: string;
	date_create: string;
	date_delete: string;
}

// Тело запроса для PUT /accruals/{id}
export interface UpdateAccrual extends Partial<CreateAccrual> {
	accrual_guid: string;
}

// Статистика по начислениям
export interface AccrualStats {
	total_accruals: number;
	total_amount: number;
	average_amount: number;
	monthly_accruals: number;
	top_types: Array<{
		type_guid: string;
		type_name: string;
		count: number;
		total_amount: number;
	}>;
}
