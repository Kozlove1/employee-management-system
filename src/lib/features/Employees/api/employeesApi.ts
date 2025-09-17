import { BaseApiService } from '$lib/api/base/BaseApiService'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type { PaginationParams } from '$lib/api/types'
import type {
	CreateEmployeeData,
	EmployeeApiResponse,
	EmployeeSearchParams,
	EmployeeStatsApiResponse,
	EmployeesWithDetailsApiResponse,
	EmployeeWithDetailsApiResponse,
	UpdateEmployeeData
} from './types'

class EmployeesApiService extends BaseApiService {
	// Получить всех сотрудников
	async getAll(params?: EmployeeSearchParams) {
		return this.get<EmployeesWithDetailsApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BASE, 
			params,
			{ timeout: 15000 } // Увеличиваем таймаут для больших списков
		)
	}

	// Получить сотрудника по ID
	async getById(employeeGuid: string) {
		return this.get<EmployeeWithDetailsApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BY_ID(employeeGuid)
		)
	}

	// Поиск сотрудников
	async search(params: EmployeeSearchParams) {
		return this.get<EmployeesWithDetailsApiResponse>(
			API_ENDPOINTS.EMPLOYEES.SEARCH, 
			params
		)
	}

	// Создать сотрудника
	async create(data: CreateEmployeeData) {
		return this.post<EmployeeApiResponse>(API_ENDPOINTS.EMPLOYEES.BASE, data)
	}

	// Обновить сотрудника
	async update(data: UpdateEmployeeData) {
		return this.put<EmployeeApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BY_ID(data.employee_guid), 
			data
		)
	}

	// Удалить сотрудника
	async deleteEmployee(employeeGuid: string) {
		return this.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(employeeGuid))
	}

	// Получить статистику по сотрудникам
	async getStats() {
		return this.get<EmployeeStatsApiResponse>(API_ENDPOINTS.EMPLOYEES.STATS)
	}

	// Получить сотрудников по подразделению
	async getByDepartment(departmentGuid: string, params?: PaginationParams) {
		return this.get<EmployeesWithDetailsApiResponse>(
			API_ENDPOINTS.DEPARTMENTS.EMPLOYEES(departmentGuid), 
			params
		)
	}
}

export const employeesApi = new EmployeesApiService()
