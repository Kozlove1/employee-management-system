// Базовые типы для всех сущностей
export interface BaseEntity {
	org_guid: string
}

export interface BaseEmployeeEntity extends BaseEntity {
	employee_guid: string
	employee_name?: string
}

export interface BaseDepartmentEntity extends BaseEntity {
	department_guid: string
	department_name?: string
}

export interface BasePositionEntity extends BaseEntity {
	post_guid: string
	post?: string
	position_name?: string
}

// Общие поля для дат
export interface DateFields {
	datecreate?: string
	datedisband?: string
	dateemploy?: string
	datedismis?: string
}

interface BaseDisplayEntity extends BaseEntity, DateFields {
}

interface EmployeeDisplayEntity extends BaseDisplayEntity, BaseEmployeeEntity, BaseDepartmentEntity, BasePositionEntity {
	ident: string
	employee: string
	email: string
	sex: string
	person_guid: string
	balance?: number
}

// Общие типы для статистики
export interface BaseStats {
	total_count: number
	active_count: number
	inactive_count: number
}

export interface EmployeeStats {
	employee_guid: string
	employee_name: string
	ident: string
	total_balance: number
	department_name: string
}

// Общие типы для начислений
export interface AccrualType {
	org_guid?: string
	type_guid: string
	type_name: string
	ammo_coins_amount?: number
}

// Базовый тип сотрудника
export interface Employee extends EmployeeDisplayEntity {
	// Все поля уже определены в EmployeeDisplayEntity
}

// UI типы для отображения
export type EmployeeWithDetails = EmployeeDisplayEntity
