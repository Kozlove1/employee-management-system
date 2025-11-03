export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		LOGOUT: '/auth/logout',
		REFRESH: '/auth/refresh',
		ME: '/auth/me',
	},
	
	EMPLOYEES: {
		BASE: '/employees',
		BY_ID: (id: string) => `/employees/${id}`,
		SEARCH: '/employees/search',
		STATS: '/employees/stats',
		BY_DEPARTMENT: (departmentGuid: string) => `/employees/department/${departmentGuid}`,
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
		COMBINED: '/statistics/combined',
	},
	
	DEPARTMENTS: {
		BASE: '/departments',
		BY_ID: (id: string) => `/departments/${id}`,
		EMPLOYEES: (id: string) => `/departments/${id}/employees`,
	},
	
	POSITIONS: {
		BASE: '/positions',
		BY_ID: (id: string) => `/positions/${id}`,
		BY_DEPARTMENT: (departmentId: string) => `/positions/department/${departmentId}`,
	},
}
