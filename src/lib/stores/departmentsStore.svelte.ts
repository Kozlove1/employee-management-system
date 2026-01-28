import { departmentsApi } from '$lib/api/departments'
import type { Department } from '$lib/api/departments/types'

class DepartmentsStore {
	private departments = $state<Department[]>([])
	private isLoading = $state<boolean>(false)
	private error = $state<string | null>(null)
	private searchTerm = $state<string>('')
	private abortController: AbortController | null = null
	private cache = new Map<string, { data: Department[]; timestamp: number }>()
	private hasInitialized = false
	private readonly CACHE_TTL = 5 * 60 * 1000

	getDepartments() {
		return this.departments
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

	private setLoading(loading: boolean) {
		this.isLoading = loading
	}

	private setError(error: string | null) {
		this.error = error
	}

	private clearError() {
		this.error = null
	}

	private mapDepartments(departmentsList: Department[]): Department[] {
		return departmentsList.map((dept) => {
			const deptGuid = (dept.department_guid as string) || (dept.id as string) || ''
			return {
				...dept,
				id: deptGuid,
				department_guid: deptGuid,
			} as Department
		})
	}

	private getCacheKey(search: string): string {
		return search.trim().toLowerCase()
	}

	private getFromCache(key: string): Department[] | null {
		const cached = this.cache.get(key)
		if (!cached) return null

		const now = Date.now()
		if (now - cached.timestamp > this.CACHE_TTL) {
			this.cache.delete(key)
			return null
		}

		return cached.data
	}

	private setCache(key: string, data: Department[]) {
		this.cache.set(key, {
			data,
			timestamp: Date.now()
		})
	}

	private cancelPreviousRequest() {
		if (this.abortController) {
			this.abortController.abort()
		}
		this.abortController = new AbortController()
	}

	async fetchDepartments() {
		this.setLoading(true)
		this.clearError()
		this.cancelPreviousRequest()

		try {
			const cacheKey = this.getCacheKey('')
			const cached = this.getFromCache(cacheKey)
			if (cached) {
				this.departments = cached
				this.setLoading(false)
				return
			}

			const response = await departmentsApi.getAll({ page: -1 })

			if (response.status === 'success') {
				const listResponse = response.data as unknown as {
					list: Department[]
					page: number
					total_page: number
					total: number
				}

				const departmentsList = listResponse.list || []
				const mapped = this.mapDepartments(departmentsList)
				this.departments = mapped
				this.setCache(cacheKey, mapped)
			} else {
				this.setError(response.message || 'Ошибка загрузки подразделений')
			}
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				return
			}
			this.setError(err instanceof Error ? err.message : 'Ошибка загрузки подразделений')
		} finally {
			this.setLoading(false)
		}
	}

	async searchDepartments(search: string) {
		this.searchTerm = search
		const trimmedSearch = search.trim()

		if (!trimmedSearch) {
			await this.fetchDepartments()
			return
		}

		const cacheKey = this.getCacheKey(trimmedSearch)
		const cached = this.getFromCache(cacheKey)
		if (cached) {
			this.departments = cached
			return
		}

		this.setLoading(true)
		this.clearError()
		this.cancelPreviousRequest()

		try {
			const response = await departmentsApi.getAll({
				page: -1,
				search: trimmedSearch
			})

			if (response.status === 'success') {
				const listResponse = response.data as unknown as {
					list: Department[]
					page: number
					total_page: number
					total: number
				}

				const departmentsList = listResponse.list || []
				const mapped = this.mapDepartments(departmentsList)
				this.departments = mapped
				this.setCache(cacheKey, mapped)
			} else {
				this.setError(response.message || 'Ошибка поиска подразделений')
			}
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				return
			}
			this.setError(err instanceof Error ? err.message : 'Ошибка поиска подразделений')
		} finally {
			this.setLoading(false)
		}
	}

	clearCache() {
		this.cache.clear()
	}

	async initialize() {
		if (this.hasInitialized || this.isLoading) {
			return
		}

		this.hasInitialized = true

		if (this.departments.length === 0) {
			await this.fetchDepartments()
		}
	}
}

export const departmentsStore = new DepartmentsStore()
