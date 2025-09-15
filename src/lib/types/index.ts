export interface Organization {
	org_guid: string
}

// Утилитарные типы
export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'employees' | 'accruals' | 'departments' | 'positions' | 'statistics'

export interface FilterOptions {
	search?: string
	department_guid?: string
	active_only?: boolean
	date_from?: string
	date_to?: string
}
