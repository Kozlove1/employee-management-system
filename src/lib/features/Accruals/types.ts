import type { BaseDepartmentEntity, BaseEmployeeEntity, BaseEntity, BasePositionEntity, DateFields } from '$lib/types/shared'

export interface Accrual extends BaseEntity, BasePositionEntity, BaseDepartmentEntity, DateFields {
	post: string
}

export interface AccrualWithDetails extends Accrual, BaseEmployeeEntity {
	type_name?: string
	amount?: number
	comment?: string
	type_guid?: string
}

export interface AccrualFormData {
	org_guid?: string
	employee_guid: string
	type_guid: string
	amount: number
	date: string
	comment?: string
}
