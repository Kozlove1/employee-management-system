import type { EmployeeStats } from '$lib/types/shared'
import {
	mapAccrualStatisticsRaw,
	mapEmployeeStatsRaw,
	statisticsApi,
} from '../api'
import type { AccrualStatisticsRaw, EmployeeStatsRaw } from '../api/types'
import type { AccrualTypeStats } from '../types'

const ARRAY_KEYS = [
	'data',
	'list',
	'items',
	'result',
	'employee_stats',
	'accrual_type_stats',
	'employees',
	'accruals',
]

/** Извлекает массив из response.data: массив или объект с одним из известных ключей */
function extractArray(data: unknown): unknown[] {
	if (Array.isArray(data)) return data
	if (data && typeof data === 'object') {
		const obj = data as Record<string, unknown>
		for (const key of ARRAY_KEYS) {
			const val = obj[key]
			if (Array.isArray(val)) return val
		}
		// Любой ключ, чьё значение — массив
		for (const key of Object.keys(obj)) {
			const val = obj[key]
			if (Array.isArray(val)) return val
		}
	}
	return []
}

class StatisticsStore {
	private topEmployees = $state<EmployeeStats[]>([])
	private topAccrualTypes = $state<AccrualTypeStats[]>([])
	private isLoading = $state<boolean>(false)
	private error = $state<string | null>(null)
	private topEmployeesCount = $state<number>(10)
	private topAccrualTypesCount = $state<number>(10)

	getTopEmployees() {
		return this.topEmployees
	}

	getTopAccrualTypes() {
		return this.topAccrualTypes
	}

	getIsLoading() {
		return this.isLoading
	}

	getError() {
		return this.error
	}

	getTopEmployeesCount() {
		return this.topEmployeesCount
	}

	getTopAccrualTypesCount() {
		return this.topAccrualTypesCount
	}

	hasData = $derived(this.topEmployees.length > 0 || this.topAccrualTypes.length > 0)

	setLoading(loading: boolean) {
		this.isLoading = loading
	}

	setError(error: string | null) {
		this.error = error
	}

	clearError() {
		this.error = null
	}

	setTopEmployeesCount(count: number) {
		this.topEmployeesCount = count
		if (this.topEmployees.length > 0) {
			this.fetchStatistics()
		}
	}

	setTopAccrualTypesCount(count: number) {
		this.topAccrualTypesCount = count
		if (this.topAccrualTypes.length > 0) {
			this.fetchStatistics()
		}
	}

	async fetchStatistics() {
		if (this.isLoading) return

		this.setLoading(true)
		this.clearError()

		try {
			const [employeesRes, accrualsRes] = await Promise.all([
				statisticsApi.getEmployeeStats({ limit: this.topEmployeesCount }),
				statisticsApi.getAccrualStats({ limit: this.topAccrualTypesCount }),
			])

			const employeesOk = employeesRes.status === 'success'
			const accrualsOk = accrualsRes.status === 'success'

			if (employeesOk) {
				const rawArr = extractArray(employeesRes.data)
				const mapped = rawArr
					.map((r) => mapEmployeeStatsRaw(r as EmployeeStatsRaw))
					.sort((a, b) => (b.total_balance ?? 0) - (a.total_balance ?? 0))
					.slice(0, this.topEmployeesCount)
				this.topEmployees = mapped
			} else {
				this.topEmployees = []
			}

			if (accrualsOk) {
				const rawArr = extractArray(accrualsRes.data)
				const mapped = rawArr
					.map((r) => mapAccrualStatisticsRaw(r as AccrualStatisticsRaw))
					.sort((a, b) => b.total_count - a.total_count)
					.slice(0, this.topAccrualTypesCount)
				this.topAccrualTypes = mapped
			} else {
				this.topAccrualTypes = []
			}

			if (!employeesOk || !accrualsOk) {
				const msg =
					!employeesOk && !accrualsOk
						? 'Не удалось загрузить статистику'
						: !employeesOk
							? (employeesRes.message ?? 'Ошибка загрузки сотрудников')
							: (accrualsRes.message ?? 'Ошибка загрузки типов начислений')
				this.setError(msg)
			}
		} catch (err) {
			this.setError(
				err instanceof Error ? err.message : 'Произошла неизвестная ошибка при загрузке статистики'
			)
			this.topEmployees = []
			this.topAccrualTypes = []
		} finally {
			this.setLoading(false)
		}
	}

	refreshData() {
		this.fetchStatistics()
	}

	retry() {
		this.clearError()
		this.fetchStatistics()
	}

	simulateError() {
		this.setError('Демонстрация ошибки: Не удалось загрузить статистику с сервера.')
	}

	async initialize() {
		await this.fetchStatistics()
	}
}

export const statisticsStore = new StatisticsStore()
