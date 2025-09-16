import { apiClient } from '$lib/api/client'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type {
	CreateEmployeeData,
	EmployeeApiResponse,
	EmployeeSearchParams,
	EmployeeStatsApiResponse,
	EmployeesWithDetailsApiResponse,
	EmployeeWithDetailsApiResponse,
	UpdateEmployeeData
} from './types'

class EmployeesApiService {
	// Получить всех сотрудников
	async getAll(params?: EmployeeSearchParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString() 
			? `${API_ENDPOINTS.EMPLOYEES.BASE}?${searchParams.toString()}`
			: API_ENDPOINTS.EMPLOYEES.BASE

		return apiClient.get<EmployeesWithDetailsApiResponse>(endpoint, {
			timeout: 15000,   // Увеличиваем таймаут для больших списков
		})
	}

	// Получить сотрудника по ID
	async getById(employeeGuid: string) {
		return apiClient.get<EmployeeWithDetailsApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BY_ID(employeeGuid)
		)
	}

	// Поиск сотрудников
	async search(params: EmployeeSearchParams) {
		const searchParams = new URLSearchParams()
		
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				searchParams.append(key, String(value))
			}
		})

		return apiClient.get<EmployeesWithDetailsApiResponse>(
			`${API_ENDPOINTS.EMPLOYEES.SEARCH}?${searchParams.toString()}`
		)
	}

	// Создать сотрудника
	async create(data: CreateEmployeeData) {
		return apiClient.post<EmployeeApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BASE,
			data
		)
	}

	// Обновить сотрудника
	async update(data: UpdateEmployeeData) {
		return apiClient.put<EmployeeApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BY_ID(data.employee_guid),
			data
		)
	}

	// Удалить сотрудника
	async delete(employeeGuid: string) {
		return apiClient.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(employeeGuid))
	}

	// Получить статистику по сотрудникам
	async getStats() {
		return apiClient.get<EmployeeStatsApiResponse>(API_ENDPOINTS.EMPLOYEES.STATS)
	}

	// Получить сотрудников по подразделению
	async getByDepartment(departmentGuid: string, params?: PaginationParams) {
		const searchParams = new URLSearchParams()
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value))
				}
			})
		}

		const endpoint = searchParams.toString()
			? `${API_ENDPOINTS.DEPARTMENTS.EMPLOYEES(departmentGuid)}?${searchParams.toString()}`
			: API_ENDPOINTS.DEPARTMENTS.EMPLOYEES(departmentGuid)

		return apiClient.get<EmployeesWithDetailsApiResponse>(endpoint)
	}
}

export const employeesApi = new EmployeesApiService()
