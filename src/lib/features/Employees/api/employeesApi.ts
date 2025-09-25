import { ApiService } from '$lib/api'
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

class EmployeesApiService extends ApiService {
	constructor() {
		super(API_ENDPOINTS.EMPLOYEES.BASE)
	}
	public async getAll(params?: EmployeeSearchParams) {
		return this.get<EmployeesWithDetailsApiResponse>('', params)
	}

	public	async getById(employeeGuid: string) {
		return this.get<EmployeeWithDetailsApiResponse>(`/${employeeGuid}`)
	}

	public async search(params: EmployeeSearchParams) {
		return this.get<EmployeesWithDetailsApiResponse>('/search', params)
	}

	public async create(data: CreateEmployeeData) {
		return this.post<EmployeeApiResponse>('', data)
	}

	public async update(data: UpdateEmployeeData) {
		return this.put<EmployeeApiResponse>(`/${data.employee_guid}`, data)
	}

	public async deleteEmployee(employeeGuid: string) {
		return this.delete(`/${employeeGuid}`)
	}

	public async getStats() {
		return this.get<EmployeeStatsApiResponse>('/stats')
	}

	public async getByDepartment(departmentGuid: string, params?: PaginationParams) {
		return this.get<EmployeesWithDetailsApiResponse>(`/department/${departmentGuid}`, params)
	}
}

export const employeesApi = new EmployeesApiService()
