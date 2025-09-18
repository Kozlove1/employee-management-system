import type { AccrualFormData, AccrualWithDetails } from '../types'

import { accrualTypesStore } from '$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte'

import { mockEmployees } from '$lib/features/Employees/mocks/employeesMockData'
import { generateAccrualId, mockAccrualsData } from '../mocks/mockAccrualsData'

class AccrualStore {
	private accruals = $state<AccrualWithDetails[]>([])
	private isLoading = $state<boolean>(false)
	private error = $state<string | null>(null)
	private searchTerm = $state<string>('')
	private selectedEmployee = $state<string>('')
	private selectedType = $state<string>('')
	private sortOrder = $state<'newest' | 'oldest'>('newest')

	getAccruals(): AccrualWithDetails[] {
		return this.accruals
	}

	getIsLoading(): boolean {
		return this.isLoading
	}

	getError(): string | null {
		return this.error
	}

	getSearchTerm(): string {
		return this.searchTerm
	}

	getSelectedEmployee(): string {
		return this.selectedEmployee
	}

	getSelectedType(): string {
		return this.selectedType
	}

	getSortOrder(): 'newest' | 'oldest' {
		return this.sortOrder
	}

	filteredAccruals = $derived.by(() => {
		let filtered = [...this.accruals]

		if (this.searchTerm) {
			const searchLower = this.searchTerm.toLowerCase()
			filtered = filtered.filter(
				(accrual) =>
					accrual.employee_name?.toLowerCase().includes(searchLower) ||
					accrual.type_name?.toLowerCase().includes(searchLower) ||
					accrual.comment?.toLowerCase().includes(searchLower)
			)
		}

		if (this.selectedEmployee) {
			filtered = filtered.filter((accrual) => accrual.employee_guid === this.selectedEmployee)
		}

		if (this.selectedType) {
			filtered = filtered.filter((accrual) => accrual.type_guid === this.selectedType)
		}

		if (this.sortOrder === 'oldest') {
			filtered.sort((a, b) => {
				const dateA = a.datecreate ? new Date(a.datecreate).getTime() : 0
				const dateB = b.datecreate ? new Date(b.datecreate).getTime() : 0
				return dateA - dateB
			})
		} else {
			filtered.sort((a, b) => {
				const dateA = a.datecreate ? new Date(a.datecreate).getTime() : 0
				const dateB = b.datecreate ? new Date(b.datecreate).getTime() : 0
				return dateB - dateA
			})
		}

		return filtered
	})

	uniqueEmployees = $derived.by(() => {
		const employeeMap = new Map()
		this.accruals.forEach((accrual) => {
			if (accrual.employee_guid && accrual.employee_name) {
				employeeMap.set(accrual.employee_guid, {
					employee_guid: accrual.employee_guid,
					employee_name: accrual.employee_name
				})
			}
		})
		return Array.from(employeeMap.values())
	})

	uniqueTypes = $derived.by(() => {
		const typeMap = new Map()
		this.accruals.forEach((accrual) => {
			if (accrual.type_guid && accrual.type_name) {
				typeMap.set(accrual.type_guid, {
					type_guid: accrual.type_guid,
					type_name: accrual.type_name
				})
			}
		})
		return Array.from(typeMap.values())
	})

	stats = $derived.by(() => {
		const currentMonth = new Date().getMonth()
		const currentYear = new Date().getFullYear()

		const monthlyAccruals = this.accruals.filter((accrual) => {
			if (!accrual.datecreate) return false
			const accrualDate = new Date(accrual.datecreate)
			return accrualDate.getMonth() === currentMonth && accrualDate.getFullYear() === currentYear
		})

		const monthlyAmount = monthlyAccruals.reduce((sum, accrual) => sum + (accrual.amount || 0), 0)

		return {
			total: this.accruals.length,
			monthlyCount: monthlyAccruals.length,
			monthlyAmount
		}
	})

	setLoading(loading: boolean): void {
		this.isLoading = loading
	}

	setError(error: string | null): void {
		this.error = error
	}

	clearError(): void {
		this.error = null
	}

	setSearchTerm(term: string): void {
		this.searchTerm = term
	}

	setSelectedEmployee(employeeGuid: string): void {
		this.selectedEmployee = employeeGuid
	}

	setSelectedType(typeGuid: string): void {
		this.selectedType = typeGuid
	}

	setSortOrder(order: 'newest' | 'oldest'): void {
		this.sortOrder = order
	}

	resetFilters(): void {
		this.searchTerm = ''
		this.selectedEmployee = ''
		this.selectedType = ''
	}

	async fetchAccruals(): Promise<void> {
		this.setLoading(true)
		this.clearError()

		try {
			// Пока используем мок данные, позже можно переключить на API
			await this.loadMockData()
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка загрузки начислений')
		} finally {
			this.setLoading(false)
		}
	}

	// временные, пока API не готов
	private async loadMockData(): Promise<void> {
		// Имитируем задержку API
		await new Promise(resolve => setTimeout(resolve, 500))
		this.accruals = [...mockAccrualsData]
	}

	async createAccrual(data: AccrualFormData): Promise<void> {
		this.setLoading(true)
		this.clearError()

		try {
			// Пока используем мок данные
			await this.createMockAccrual(data)
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка создания начисления')
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	private async createMockAccrual(data: AccrualFormData): Promise<void> {
		// Имитируем задержку API
		await new Promise(resolve => setTimeout(resolve, 300))

		const employee = mockEmployees.find((e) => e.employee_guid === data.employee_guid)
		const type = accrualTypesStore.types.find((t) => t.type_guid === data.type_guid)

		if (!employee || !type) {
			throw new Error('Employee or Accrual Type not found')
		}

		const newAccrual: AccrualWithDetails = {
			org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
			post_guid: generateAccrualId(),
			post: `${type.type_name} - ${data.amount} ${type.ammo_coins_amount ? 'АК' : 'руб'}`,
			department_guid: employee.department_guid,
			datecreate: data.date,
			datedisband: '',

			employee_name: employee.employee,
			employee_guid: data.employee_guid,
			type_name: type.type_name,
			type_guid: data.type_guid,
			amount: data.amount,
			comment: data.comment
		}

		// Добавляем в начало массива
		this.accruals.unshift(newAccrual)
	}

	async updateAccrual(accrualGuid: string, data: AccrualFormData): Promise<void> {
		this.setLoading(true)
		this.clearError()

		try {
			// Пока используем мок данные
			await this.updateMockAccrual(accrualGuid, data)
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка обновления начисления')
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	private async updateMockAccrual(accrualGuid: string, data: AccrualFormData): Promise<void> {
		// Имитируем задержку API
		await new Promise(resolve => setTimeout(resolve, 300))

		const index = this.accruals.findIndex((accrual) => accrual.post_guid === accrualGuid)

		if (index === -1) {
			throw new Error('Accrual not found')
		}

		const employee = mockEmployees.find((e) => e.employee_guid === data.employee_guid)
		const type = accrualTypesStore.types.find((t) => t.type_guid === data.type_guid)

		if (!employee || !type) {
			throw new Error('Employee or Accrual Type not found')
		}

		const updatedAccrual: AccrualWithDetails = {
			...this.accruals[index],
			post: `${type.type_name} - ${data.amount} ${type.ammo_coins_amount ? 'АК' : 'руб'}`,
			department_guid: employee.department_guid,
			datecreate: data.date,

			employee_name: employee.employee,
			employee_guid: data.employee_guid,
			type_name: type.type_name,
			type_guid: data.type_guid,
			amount: data.amount,
			comment: data.comment
		}

		this.accruals[index] = updatedAccrual
	}

	async deleteAccrual(accrualGuid: string): Promise<void> {
		this.setLoading(true)
		this.clearError()

		try {
			// Пока используем мок данные
			await this.deleteMockAccrual(accrualGuid)
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка удаления начисления')
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	private async deleteMockAccrual(accrualGuid: string): Promise<void> {
		// Имитируем задержку API
		await new Promise(resolve => setTimeout(resolve, 300))

		const index = this.accruals.findIndex((accrual) => accrual.post_guid === accrualGuid)

		if (index === -1) {
			throw new Error('Accrual not found')
		}

		this.accruals.splice(index, 1)
	}

	async initialize(): Promise<void> {
		await this.fetchAccruals()
	}
}

export const accrualStore = new AccrualStore()
