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

// Общие типы для фильтрации
export interface BaseFilterOptions {
	search?: string
	department_guid?: string
	active_only?: boolean
	date_from?: string
	date_to?: string
}

// Общие типы для пагинации
export interface PaginationOptions {
	page?: number
	limit?: number
	sort?: string
	order?: 'asc' | 'desc'
}

// Общие типы для сортировки
export type SortDirection = 'asc' | 'desc'
export type SortField = string

// Общие типы для статусов
export type EntityStatus = 'active' | 'inactive' | 'pending'
export type ViewMode = 'employees' | 'accruals' | 'departments' | 'positions' | 'statistics'

// Общие типы для форм
export interface BaseFormData {
	org_guid: string
}

export interface EmployeeFormData extends BaseFormData {
	employee: string
	ident: string
	email: string
	sex: 'Мужской' | 'Женский'
	department_guid: string
	position_name: string
	dateemploy: string
}

// Общие типы для отображения
export interface BaseDisplayEntity extends BaseEntity, DateFields {
	// Базовые поля для отображения
}

export interface EmployeeDisplayEntity extends BaseDisplayEntity, BaseEmployeeEntity, BaseDepartmentEntity, BasePositionEntity {
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

// Общие типы для API
export interface BaseApiEntity {
	org_guid: string
}

export interface BaseApiResponse<T = any> {
	data: T
	message?: string
	status: 'success' | 'error'
}

export interface BaseApiError {
	message: string
	code?: string | number
	details?: any
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
