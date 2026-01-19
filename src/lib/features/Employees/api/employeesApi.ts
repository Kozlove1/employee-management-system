import { ApiService } from '$lib/api'
import { API_ENDPOINTS } from '$lib/api/endpoints'

import type {
    CreateEmployeeData,
    EmployeeApiResponse,
    EmployeeSearchParams,
    EmployeesListApiResponse,
    EmployeeWithDetailsApiResponse,
    UpdateEmployeeData
} from './types'

class EmployeesApiService extends ApiService {
	constructor() {
		super(API_ENDPOINTS.EMPLOYEES.BASE)
	}
	
	public async getAll(params?: EmployeeSearchParams) {
		return this.get<EmployeesListApiResponse>('', params)
	}

	public async getById(id: string) {
		return this.get<EmployeeWithDetailsApiResponse>(`/${id}`)
	}

	public async create(data: CreateEmployeeData) {
		return this.post<EmployeeApiResponse>('', data)
	}

	public async update(id: string, data: UpdateEmployeeData) {
		return this.put<EmployeeApiResponse>(`/${id}`, data)
	}

	public async deleteEmployee(id: string) {
		return this.delete(`/${id}`)
	}
}

export const employeesApi = new EmployeesApiService()
