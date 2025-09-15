export interface Department {
	org_guid: string
	department: string
	department_guid: string
	department_code: string
	parentdep_guid?: string
	datecreate: string
	datedisband: string
	headofdep_guid?: string
}

export interface Position {
	position_guid: string
	position_name: string
	department_guid: string
}

export interface DepartmentWithDetails extends Department {
	employee_count?: number
	head_name?: string
}
