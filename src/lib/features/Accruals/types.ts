import type {
	BaseDepartmentEntity,
	BaseEmployeeEntity,
	BaseEntity,
	BasePositionEntity,
	DateFields,
} from "$lib/types/shared";

export interface Accrual
	extends BaseEntity,
		BasePositionEntity,
		BaseDepartmentEntity,
		DateFields {
	post: string;
}

export interface AccrualWithDetails extends Accrual, BaseEmployeeEntity {
	accrual_guid: string;
	type_name: string;
	amount: number;
	comment?: string;
	type_guid: string;
	date: string;
}

export interface AccrualFormData {
	org_guid: string;
	employee_guid: string;
	type_guid: string;
	amount: number;
	date: string;
	comment?: string;
	department_guid: string;
	post_guid: string;
	date_create: string;
	date_delete: string;
}
