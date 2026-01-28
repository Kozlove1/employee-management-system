import { employeeStore } from '$lib/features/Employees/store/employeeStore.svelte'
import { accrualTypesStore } from '$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte'
import type { AccrualType, EmployeeWithDetails } from '$lib/types/shared'
import { accrualsApi } from '../api/accrualsApi'
import type {
	AccrualSearchParams,
	AccrualStats,
	AccrualsWithDetails,
	ApiAccrualItem,
	CreateAccrual,
	UpdateAccrual
} from '../api/types'
import type { AccrualFormData, AccrualWithDetails } from '../types'

class AccrualStore {
	private accruals = $state<AccrualWithDetails[]>([])
	private isLoading = $state<boolean>(false)
	private error = $state<string | null>(null)
	private searchTerm = $state<string>('')
	private selectedEmployee = $state<string>('')
	private selectedType = $state<string>('')
	private selectedDepartment = $state<string>('')
	private sortOrder = $state<'newest' | 'oldest'>('newest')
	private hasInitialized = $state<boolean>(false)
	private currentPage = $state<number>(1)
	private itemsPerPage = $state<number>(50)
	private totalCount = $state<number>(0)
	private totalPagesFromApi = $state<number>(1)
	private statsData = $state<AccrualStats | null>(null)
	private isStatsLoading = $state<boolean>(false)
	private statsError = $state<string | null>(null)

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

	getSelectedDepartment(): string {
		return this.selectedDepartment
	}

	getSortOrder(): 'newest' | 'oldest' {
		return this.sortOrder
	}

	getCurrentPage(): number {
		return this.currentPage
	}

	getItemsPerPage(): number {
		return this.itemsPerPage
	}

	getTotalCount(): number {
		return this.totalCount
	}

	getStats(): AccrualStats | null {
		return this.statsData
	}

	getIsStatsLoading(): boolean {
		return this.isStatsLoading
	}

	totalPages = $derived.by(() => {
		return this.totalPagesFromApi > 0
			? this.totalPagesFromApi
			: this.totalCount > 0
				? Math.ceil(this.totalCount / this.itemsPerPage)
				: this.accruals.length > 0
					? 1
					: 0
	})

	filteredAccruals = $derived(this.accruals)

	setLoading(loading: boolean): void {
		this.isLoading = loading
	}

	setError(error: string | null): void {
		this.error = error
	}

	clearError(): void {
		this.error = null
	}

	setSearchTerm(term: string, skipFetch = false): void {
		this.searchTerm = term
		this.currentPage = 1
		if (!skipFetch) {
			this.fetchAccruals()
		}
	}

	setSelectedEmployee(employeeGuid: string, skipFetch = false): void {
		this.selectedEmployee = employeeGuid
		this.currentPage = 1
		if (!skipFetch) {
			this.fetchAccruals()
		}
	}

	setSelectedType(typeGuid: string, skipFetch = false): void {
		this.selectedType = typeGuid
		this.currentPage = 1
		if (!skipFetch) {
			this.fetchAccruals()
		}
	}

	setSelectedDepartment(departmentGuid: string, skipFetch = false): void {
		this.selectedDepartment = departmentGuid
		this.currentPage = 1
		if (!skipFetch) {
			this.fetchAccruals()
		}
	}

	setSortOrder(order: 'newest' | 'oldest', skipFetch = false): void {
		this.sortOrder = order
		this.currentPage = 1
		if (!skipFetch) {
			this.fetchAccruals()
		}
	}

	public resetFilters(): void {
		this.setSearchTerm('', true)
		this.setSelectedEmployee('', true)
		this.setSelectedType('', true)
		this.setSelectedDepartment('', true)
		this.setSortOrder('newest', true)
		this.currentPage = 1
		this.fetchAccruals()
	}

	public refresh(): void {
		this.fetchAccruals()
		this.fetchStats()
	}

	nextPage(): void {
		if (this.currentPage < this.totalPages) {
			this.currentPage++
			this.fetchAccruals()
		}
	}

	prevPage(): void {
		if (this.currentPage > 1) {
			this.currentPage--
			this.fetchAccruals()
		}
	}

	goToPage(page: number): void {
		if (page >= 1 && page <= this.totalPages) {
			this.currentPage = page
			this.fetchAccruals()
		}
	}

	private buildFetchParams(): AccrualSearchParams {
		const params: AccrualSearchParams = {
			page: this.currentPage,
			limit: this.itemsPerPage,
			sort: 'date',
			order: this.sortOrder === 'newest' ? 'desc' : 'asc'
		}

		const trimmedSearch = this.searchTerm.trim()
		if (trimmedSearch) {
			params.search = trimmedSearch
		}

		if (this.selectedEmployee) {
			params.employee_guid = this.selectedEmployee
		}

		if (this.selectedType) {
			params.type_guid = this.selectedType
		}

		if (this.selectedDepartment) {
			params.department_guid = this.selectedDepartment
		}

		return params
	}

	private createEmployeeMap(): Map<string, EmployeeWithDetails> {
		const lookupEmployees = employeeStore.getLookupEmployees()
		const employees = lookupEmployees.length > 0 ? lookupEmployees : employeeStore.getApiEmployees()

		const employeeMap = new Map<string, EmployeeWithDetails>()
		for (const emp of employees) {
			if (emp.employee_guid) {
				employeeMap.set(emp.employee_guid, emp)
			}
		}
		return employeeMap
	}

	private createTypeMap(): Map<string, AccrualType> {
		const types = accrualTypesStore.types
		const typeMap = new Map<string, AccrualType>()
		for (const t of types) {
			if (t.type_guid) {
				typeMap.set(t.type_guid, t)
			}
		}
		return typeMap
	}

	private mapApiAccrual(
		item: ApiAccrualItem,
		employeeMap: Map<string, EmployeeWithDetails>,
		typeMap: Map<string, AccrualType>
	): AccrualWithDetails {
		const employeeGuid =
			item.employee_guid || item.employee?.employee_guid || item.employee?.id || ''
		const typeGuid = item.type_guid || item.type?.type_guid || item.type?.id || ''

		const employee = employeeGuid ? employeeMap.get(employeeGuid) : undefined
		const type = typeGuid ? typeMap.get(typeGuid) : undefined

		return {
			accrual_guid: item.accrual_guid || item.id || '',
			org_guid: item.org_guid || employee?.org_guid || '',
			employee_guid: employeeGuid || employee?.employee_guid || '',
			type_guid: typeGuid || type?.type_guid || '',
			department_guid: item.department_guid || employee?.department_guid || '',
			post_guid: item.post_guid || employee?.post_guid || '',
			amount: item.amount ?? 0,
			date: item.date || '',
			comment: item.comment || '',
			date_create: item.date_create || '',
			date_delete: item.date_delete || '',
			employee_name: employee?.employee || employee?.employee_name || item.employee?.employee,
			type_name: type?.type_name || item.type?.type_name || '',
			post: employee?.post || item.post || item.employee?.post || '',
			position_name: employee?.position_name || item.position_name || item.employee?.position_name,
			department_name: employee?.department_name || item.employee?.department_name
		}
	}

	public async fetchStats(): Promise<void> {
		this.isStatsLoading = true
		this.statsError = null

		try {
			const response = await accrualsApi.getAll({ page: -1 })

			if (response.status === 'success') {
				const listResponse = (response.data ?? {}) as AccrualsWithDetails
				const accrualsList = listResponse.list || []

				const now = new Date()
				const currentMonth = now.getMonth()
				const currentYear = now.getFullYear()
				const monthStart = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-`

				let monthlyCount = 0
				let monthlyAmount = 0

				for (const item of accrualsList) {
					if (item.date?.startsWith(monthStart)) {
						monthlyCount++
						monthlyAmount += item.amount ?? 0
					}
				}

				this.statsData = {
					total_accruals: monthlyCount,
					total_amount: monthlyAmount,
					average_amount: monthlyCount > 0 ? monthlyAmount / monthlyCount : 0,
					monthly_accruals: monthlyCount,
					top_types: []
				}
			} else {
				this.statsError = response.message || 'Ошибка загрузки статистики начислений'
				this.statsData = null
			}
		} catch (err) {
			this.statsError = err instanceof Error ? err.message : 'Ошибка загрузки статистики начислений'
			this.statsData = null
		} finally {
			this.isStatsLoading = false
		}
	}

	public async fetchAccruals(): Promise<void> {
		this.setLoading(true)
		this.clearError()

		try {
			const response = await accrualsApi.getAll(this.buildFetchParams())

			if (response.status === 'success') {
				const listResponse = (response.data ?? {}) as AccrualsWithDetails
				const accrualsList = listResponse.list || []

				const employeeMap = this.createEmployeeMap()
				const typeMap = this.createTypeMap()

				this.accruals = accrualsList.map((item) => this.mapApiAccrual(item, employeeMap, typeMap))

				this.totalCount = listResponse.total || 0
				this.totalPagesFromApi = listResponse.total_page || 1
			} else {
				this.setError(response.message || 'Ошибка загрузки начислений')
				this.totalCount = 0
				this.totalPagesFromApi = 0
			}
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка загрузки начислений')
			this.totalCount = 0
			this.totalPagesFromApi = 0
		} finally {
			this.setLoading(false)
		}
	}

	async createAccrual(
		data: AccrualFormData,
		options: { refreshAccruals?: boolean } = {}
	): Promise<void> {
		if (!data.type_guid) {
			throw new Error('Тип начисления обязателен для заполнения')
		}
		if (!data.employee_guid) {
			throw new Error('Сотрудник обязателен для заполнения')
		}

		this.setLoading(true)
		this.clearError()

		try {
			const payload: CreateAccrual = {
				employee_guid: data.employee_guid,
				type_guid: data.type_guid,
				amount: data.amount,
				date: data.date,
				comment: data.comment || '',
				org_guid: data.org_guid || '',
				department_guid: data.department_guid || '',
				post_guid: data.post_guid || '',
				date_create: data.date_create || '',
				date_delete: data.date_delete || ''
			}

			const response = await accrualsApi.create(payload)

			if (response.status === 'success') {
				const shouldRefresh = options.refreshAccruals ?? true
				if (shouldRefresh) {
					await Promise.all([this.fetchAccruals(), this.fetchStats()])
				} else {
					await this.fetchStats()
				}
			} else {
				this.setError(response.message || 'Ошибка создания начисления')
				throw new Error(response.message || 'Ошибка создания начисления')
			}
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка создания начисления')
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	async updateAccrual(accrualGuid: string, data: AccrualFormData): Promise<void> {
		if (!data.type_guid) {
			throw new Error('Тип начисления обязателен для заполнения')
		}
		if (!data.employee_guid) {
			throw new Error('Сотрудник обязателен для заполнения')
		}

		this.setLoading(true)
		this.clearError()

		try {
			const payload: UpdateAccrual = {
				accrual_guid: accrualGuid,
				employee_guid: data.employee_guid,
				type_guid: data.type_guid,
				amount: data.amount,
				date: data.date,
				comment: data.comment || '',
				org_guid: data.org_guid || '',
				department_guid: data.department_guid || '',
				post_guid: data.post_guid || '',
				date_create: data.date_create || '',
				date_delete: data.date_delete || ''
			}

			const response = await accrualsApi.update(payload)

			if (response.status === 'success') {
				await Promise.all([this.fetchAccruals(), this.fetchStats()])
			} else {
				this.setError(response.message || 'Ошибка обновления начисления')
				throw new Error(response.message || 'Ошибка обновления начисления')
			}
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка обновления начисления')
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	async deleteAccrual(accrualGuid: string): Promise<void> {
		this.setLoading(true)
		this.clearError()

		try {
			const response = await accrualsApi.deleteAccrual(accrualGuid)

			if (response.status === 'success') {
				await Promise.all([this.fetchAccruals(), this.fetchStats()])
			} else {
				this.setError(response.message || 'Ошибка удаления начисления')
				throw new Error(response.message || 'Ошибка удаления начисления')
			}
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка удаления начисления')
			throw err
		} finally {
			this.setLoading(false)
		}
	}

	async initialize(): Promise<void> {
		if (this.hasInitialized || this.isLoading) {
			return
		}

		this.hasInitialized = true
		this.setLoading(true)

		try {
			const promises: Promise<void>[] = []

			const types = accrualTypesStore.types
			if (types.length === 0 && !accrualTypesStore.getIsLoading()) {
				promises.push(
					accrualTypesStore.fetchTypes({
						page: -1,
						sort: 'date_create',
						order: 'desc'
					})
				)
			}

			const isLookupLoaded = employeeStore.getIsLookupLoaded()
			if (!isLookupLoaded && !employeeStore.getIsLookupLoading()) {
				promises.push(employeeStore.fetchLookupEmployees())
			}

			if (promises.length > 0) {
				await Promise.all(promises)
			}

			await Promise.all([this.fetchAccruals(), this.fetchStats()])
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Ошибка инициализации')
			this.setLoading(false)
		}
	}
}

export const accrualStore = new AccrualStore()
