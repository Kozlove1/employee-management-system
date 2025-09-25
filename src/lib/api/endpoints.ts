export const API_ENDPOINTS = {
	EMPLOYEES: {
		BASE: '/employees',
		BY_ID: (id: string) => `/employees/${id}`,
		SEARCH: '/employees/search',
		STATS: '/employees/stats',
	},
	
	ACCRUALS: {
		BASE: '/accruals',
		BY_ID: (id: string) => `/accruals/${id}`,
		BY_EMPLOYEE: (employeeId: string) => `/accruals/employee/${employeeId}`,
		STATS: '/accruals/stats',
	},
	
	ACCRUAL_TYPES: {
		BASE: '/accrual-types',
		BY_ID: (id: string) => `/accrual-types/${id}`,
		STATS: '/accrual-types/stats',
	},
	
	STATISTICS: {
		BASE: '/statistics',
		EMPLOYEES: '/statistics/employees',
		ACCRUALS: '/statistics/accruals',
		DEPARTMENTS: '/statistics/departments',
	},
	
	// TODO: Add when needed
	// DEPARTMENTS: {
	// 	BASE: '/departments',
	// 	BY_ID: (id: string) => `/departments/${id}`,
	// 	EMPLOYEES: (id: string) => `/departments/${id}/employees`,
	// },
	
	// TODO: Add when needed
	// POSITIONS: {
	// 	BASE: '/positions',
	// 	BY_ID: (id: string) => `/positions/${id}`,
	// 	BY_DEPARTMENT: (departmentId: string) => `/positions/department/${departmentId}`,
	// },
} as const
