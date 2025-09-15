import type { ApiError } from '$lib/api'
import { employeesApi } from '../api'
import type { EmployeeSearchParams, EmployeeWithDetails } from '../types'

// Пример store с полной интеграцией axios-based API
class EmployeeStoreWithAxiosApi {
	private apiEmployees = $state<EmployeeWithDetails[]>([])
	private isLoading = $state<boolean>(false)
	private error = $state<string | null>(null)
	private searchTerm = $state<string>('')
	private selectedDepartment = $state<string>('')
	private activeOnly = $state<boolean>(false)
	private currentPage = $state<number>(1)
	private itemsPerPage = $state<number>(50)
	private totalItems = $state<number>(0)
	private totalPages = $state<number>(0)
	private lastUpdated = $state<Date | null>(null)

	// Public getters for accessing state
	getApiEmployees() {
		return this.apiEmployees
	}
	getIsLoading() {
		return this.isLoading
	}
	getError() {
		return this.error
	}
	getSearchTerm() {
		return this.searchTerm
	}
	getSelectedDepartment() {
		return this.selectedDepartment
	}
	getActiveOnly() {
		return this.activeOnly
	}
	getCurrentPage() {
		return this.currentPage
	}
	getItemsPerPage() {
		return this.itemsPerPage
	}
	getTotalItems() {
		return this.totalItems
	}
	getTotalPages() {
		return this.totalPages
	}
	getLastUpdated() {
		return this.lastUpdated
	}

	// Computed values with $derived
	filteredEmployees = $derived.by(() => {
		let filtered = this.apiEmployees

		if (this.searchTerm) {
			const searchLower = this.searchTerm.toLowerCase()
			filtered = filtered.filter((emp) =>
				emp.employee.toLowerCase().includes(searchLower) ||
				emp.ident.toLowerCase().includes(searchLower) ||
				emp.email.toLowerCase().includes(searchLower)
			)
		}

		if (this.selectedDepartment) {
			filtered = filtered.filter(
				(emp) => emp.department_guid === this.selectedDepartment
			)
		}

		if (this.activeOnly) {
			filtered = filtered.filter((emp) => !emp.datedismis || emp.datedismis === '')
		}

		return filtered
	})

	totalCount = $derived(this.filteredEmployees.length)

	// Public methods for state management
	setLoading(loading: boolean) {
		this.isLoading = loading
	}

	setError(error: string | null) {
		this.error = error
	}

	clearError() {
		this.error = null
	}

	setSearchTerm(term: string) {
		this.searchTerm = term
	}

	setSelectedDepartment(departmentId: string) {
		this.selectedDepartment = departmentId
	}

	setActiveOnly(active: boolean) {
		this.activeOnly = active
	}

	setCurrentPage(page: number) {
		this.currentPage = page
	}

	setItemsPerPage(items: number) {
		this.itemsPerPage = items
	}

	// API methods with enhanced error handling
	async fetchEmployees() {
		this.setLoading(true)
		this.clearError()
		
		try {
			const params: EmployeeSearchParams = {
				page: this.currentPage,
				limit: this.itemsPerPage,
				search: this.searchTerm || undefined,
				department_guid: this.selectedDepartment || undefined,
				active_only: this.activeOnly || undefined,
			}

			const response = await employeesApi.getAll(params)
			
			if (response.status === 'success') {
				this.apiEmployees = response.data.employees
				this.lastUpdated = new Date()
				
				// Если API возвращает пагинацию
				// this.totalItems = response.data.pagination?.total || 0
				// this.totalPages = response.data.pagination?.totalPages || 0
			}
		} catch (err) {
			const errorMessage = err instanceof ApiError 
				? err.message 
				: 'Ошибка при загрузке сотрудников'
			this.setError(errorMessage)
			console.error('Error fetching employees:', err)
		} finally {
			this.setLoading(false)
		}
	}

	async fetchEmployeeById(employeeGuid: string) {
		this.setLoading(true)
		this.clearError()
		
		try {
			const response = await employeesApi.getById(employeeGuid)
			
			if (response.status === 'success') {
				return response.data.employee
			}
		} catch (err) {
			const errorMessage = err instanceof ApiError 
				? err.message 
				: 'Ошибка при загрузке сотрудника'
			this.setError(errorMessage)
			console.error('Error fetching employee:', err)
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	async createEmployee(employeeData: any) {
		this.setLoading(true)
		this.clearError()
		
		try {
			const response = await employeesApi.create(employeeData)
			
			if (response.status === 'success') {
				// Обновляем список сотрудников
				await this.fetchEmployees()
				return response.data.employee
			}
		} catch (err) {
			const errorMessage = err instanceof ApiError 
				? err.message 
				: 'Ошибка при создании сотрудника'
			this.setError(errorMessage)
			console.error('Error creating employee:', err)
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	async updateEmployee(employeeData: any) {
		this.setLoading(true)
		this.clearError()
		
		try {
			const response = await employeesApi.update(employeeData)
			
			if (response.status === 'success') {
				// Обновляем список сотрудников
				await this.fetchEmployees()
				return response.data.employee
			}
		} catch (err) {
			const errorMessage = err instanceof ApiError 
				? err.message 
				: 'Ошибка при обновлении сотрудника'
			this.setError(errorMessage)
			console.error('Error updating employee:', err)
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	async deleteEmployee(employeeGuid: string) {
		this.setLoading(true)
		this.clearError()
		
		try {
			await employeesApi.delete(employeeGuid)
			
			// Обновляем список сотрудников
			await this.fetchEmployees()
		} catch (err) {
			const errorMessage = err instanceof ApiError 
				? err.message 
				: 'Ошибка при удалении сотрудника'
			this.setError(errorMessage)
			console.error('Error deleting employee:', err)
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	// Utility methods
	refresh() {
		this.fetchEmployees()
	}

	clearFilters() {
		this.searchTerm = ''
		this.selectedDepartment = ''
		this.activeOnly = false
		this.currentPage = 1
	}

	// Метод для обработки ошибок сети
	async retryLastRequest() {
		if (this.error) {
			await this.fetchEmployees()
		}
	}
}

export const employeeStoreWithAxiosApi = new EmployeeStoreWithAxiosApi()
