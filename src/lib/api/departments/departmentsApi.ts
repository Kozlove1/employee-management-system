import { ApiService } from '$lib/api'
import { API_ENDPOINTS } from '$lib/api/endpoints'
import type {
    CreateDepartmentData,
    DepartmentApiResponse,
    DepartmentSearchParams,
    DepartmentsListApiResponse,
    UpdateDepartmentData 
} from './types'

class DepartmentsApiService extends ApiService {
	constructor() {
		super(API_ENDPOINTS.DEPARTMENTS.BASE)
	}

	public async getAll(params?: DepartmentSearchParams) {
		return this.get<DepartmentsListApiResponse>('', params)
	}

	public async getById(id: string) {
		return this.get<DepartmentApiResponse>(`/${id}`)
	}

	public async create(data: CreateDepartmentData) {
		return this.post<DepartmentApiResponse>('', data)
	}

	public async update(id: string, data: UpdateDepartmentData) {
		return this.put<DepartmentApiResponse>(`/${id}`, data)
	}

	public async deleteDepartment(id: string) {
		return this.delete(`/${id}`)
	}
}

export const departmentsApi = new DepartmentsApiService()

