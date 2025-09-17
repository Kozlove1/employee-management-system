export interface Accrual {
	org_guid: string
	post_guid: string
	post: string
	department_guid: string
	datecreate: string
	datedisband: string
}

export interface AccrualWithDetails extends Accrual {
	employee_name?: string
	type_name?: string
	amount?: number
	comment?: string
	employee_guid?: string
	type_guid?: string
}

// Типы для форм
export interface AccrualFormData {
	employee_guid: string
	type_guid: string
	amount: number
	date: string
	comment?: string
}
