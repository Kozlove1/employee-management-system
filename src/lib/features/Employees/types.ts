export interface Employee {
	org_guid: string
	post_guid: string
	ident: string
	employee: string
	employee_guid: string
	dateemploy: string
	datedismis: string
	email: string
	sex: string
	person_guid: string
	department_guid: string
}

// UI типы для отображения
export interface EmployeeWithDetails extends Employee {
	department_name: string
	position_name: string
	balance: number
}

// Типы для форм
export interface EmployeeFormData {
	employee: string
	ident: string
	email: string
	sex: 'Мужской' | 'Женский'
	department_guid: string
	position_name: string
	dateemploy: string
}

// Типы для статистики
export interface EmployeeStats {
	employee_guid: string
	employee_name: string
	ident: string
	total_balance: number
	department_name: string
}
