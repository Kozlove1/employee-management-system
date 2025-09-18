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
	public async getAll(params?: EmployeeSearchParams) {
		return this.get<EmployeesWithDetailsApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BASE, 
			params,
			{ timeout: 15000 }
		)
	}

	public	async getById(employeeGuid: string) {
		return this.get<EmployeeWithDetailsApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BY_ID(employeeGuid)
		)
	}

	public async search(params: EmployeeSearchParams) {
		return this.get<EmployeesWithDetailsApiResponse>(
			API_ENDPOINTS.EMPLOYEES.SEARCH, 
			params
		)
	}

	public async create(data: CreateEmployeeData) {
		return this.post<EmployeeApiResponse>(API_ENDPOINTS.EMPLOYEES.BASE, data)
	}

	public async update(data: UpdateEmployeeData) {
		return this.put<EmployeeApiResponse>(
			API_ENDPOINTS.EMPLOYEES.BY_ID(data.employee_guid), 
			data
		)
	}

	public async deleteEmployee(employeeGuid: string) {
		return this.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(employeeGuid))
	}

	public async getStats() {
		return this.get<EmployeeStatsApiResponse>(API_ENDPOINTS.EMPLOYEES.STATS)
	}

	public async getByDepartment(departmentGuid: string, params?: PaginationParams) {
		return this.get<EmployeesWithDetailsApiResponse>(
			API_ENDPOINTS.DEPARTMENTS.EMPLOYEES(departmentGuid), 
			params
		)
	}
}

export const employeesApi = new EmployeesApiService()
