import type { BaseFilterParams, PaginationParams } from '$lib/api/types'
import type { Employee, EmployeeStats, EmployeeWithDetails } from '$lib/types/shared'

export interface EmployeeApiResponse {
	employee: Employee
}

export interface EmployeesApiResponse {
	employees: Employee[]
}

export interface EmployeeWithDetailsApiResponse {
	employee: EmployeeWithDetails
}

export interface EmployeesWithDetailsApiResponse {
	employees: EmployeeWithDetails[]
}

export interface EmployeeStatsApiResponse {
	stats: EmployeeStats[]
}

export interface EmployeeFilterParams extends BaseFilterParams {
	department_guid?: string
	position_guid?: string
	sex?: string
}

export interface EmployeeSearchParams extends PaginationParams, EmployeeFilterParams {}

export interface CreateEmployeeData {
	employee: string
	ident: string
	email: string
	sex: 'Мужской' | 'Женский'
	department_guid: string
	position_name: string
	dateemploy: string
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
	employee_guid: string
}
