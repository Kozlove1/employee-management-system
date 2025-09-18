export interface AccrualTypeStats {
	type_guid: string
	type_name: string
	category: string
	total_count: number
	unique_employees: number
	total_amount: number
	average_amount: number
	has_fixed_amount: boolean
}

export interface DepartmentStats {
	department_guid: string
	department_name: string
	total_employees: number
	total_accruals: number
	average_balance: number
}

export interface StatisticsSummary {
	totalEmployees: number
	totalBalance: number
	averageBalance: number
}
