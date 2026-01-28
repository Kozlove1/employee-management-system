import type { BaseFilterParams, PaginationParams } from '$lib/api/types'

export interface Department {
	id: string
	org_guid: string
	department: string
	department_code?: string
	department_guid?: string
	parentdep_guid?: string
	headofdep_guid?: string
	date_create?: string
	date_delete?: string
}

export interface DepartmentApiResponse {
	department: Department
}

export interface DepartmentsListApiResponse {
	list: Department[]
	page: number
	total_page: number
	total: number
}

export interface CreateDepartmentData {
	department: string
	department_code?: string
	org_guid: string
	parentdep_guid?: string
	headofdep_guid?: string
}

export interface UpdateDepartmentData extends Partial<CreateDepartmentData> {
	// id передается в URL, не в body
}

export interface DepartmentSearchParams extends PaginationParams, BaseFilterParams {
	// Все параметры уже включены через PaginationParams и BaseFilterParams:
	// page, limit, sort, order (из PaginationParams)
	// search, date_from, date_to, active_only (из BaseFilterParams)
}
