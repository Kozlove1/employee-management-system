import type { BaseFilterParams, PaginationParams } from '$lib/api/types'
import type { Employee, EmployeeWithDetails } from '$lib/types/shared'

export interface EmployeeApiResponse {
	employee: Employee
}

export interface EmployeesListApiResponse {
	data: EmployeeWithDetails[]
	meta?: {
		total?: number
		page?: number
		limit?: number
		totalPages?: number
	}
}

export interface EmployeeWithDetailsApiResponse {
	employee: EmployeeWithDetails
}

export interface EmployeeSearchParams extends PaginationParams, BaseFilterParams {
	// Все параметры уже включены через PaginationParams и BaseFilterParams:
	// page, limit, sort, order (из PaginationParams)
	// search, date_from, date_to, active_only (из BaseFilterParams)
	
	// Дополнительные фильтры (API принимает любые поля Employee)
	department_guid?: string
}

export interface CreateEmployeeData {
	employee: string
	ident: string
	email: string
	sex: 'Мужской' | 'Женский'
	department_guid: string
	position_name: string
	date_employ: string
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
	// employee_guid передается в URL, не в body
}
