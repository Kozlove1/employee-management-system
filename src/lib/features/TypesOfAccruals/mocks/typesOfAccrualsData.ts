import type { AccrualType } from '$lib/types/shared'

export function generateTypeId(): string {
	return `type_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export interface CreateTypeOfAccrualData {
	type_name: string
	ammo_coins_amount?: number
}

export interface UpdateTypeOfAccrualData extends CreateTypeOfAccrualData {
	type_guid: string
}

export class TypesOfAccrualsDataManager {
	private static data: AccrualType[] = [
		{
			type_guid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
			type_name: 'Тестовая награда 2',
			ammo_coins_amount: 300 // Фиксированное количество АК
		},
		{
			type_guid: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
			type_name: 'Тестовая награда 3',
			ammo_coins_amount: 60 // Фиксированное количество АК
		},
		{
			type_guid: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
			type_name: 'Тестовая награда',
			ammo_coins_amount: 100 // Фиксированное количество АК
		},
		{
			type_guid: 'd4e5f6g7-h8i9-0123-def0-456789012345',
			type_name: 'Премия за выслугу лет'
			// Нет ammo_coins_amount - означает, что сумма вводится вручную
		},
		{
			type_guid: 'e5f6g7h8-i9j0-1234-ef01-567890123456',
			type_name: 'Бонус за качественную работу'
			// Нет ammo_coins_amount - означает, что сумма вводится вручную
		}
	]

	static getAll(): AccrualType[] {
		return [...this.data]
	}

	static getById(typeGuid: string): AccrualType | undefined {
		return this.data.find((type) => type.type_guid === typeGuid)
	}

	static create(data: CreateTypeOfAccrualData): AccrualType {
		const newType: AccrualType = {
			type_guid: generateTypeId(),
			type_name: data.type_name,
			ammo_coins_amount: data.ammo_coins_amount
		}

		this.data.unshift(newType)
		return newType
	}

	static update(data: UpdateTypeOfAccrualData): AccrualType | null {
		const index = this.data.findIndex((type) => type.type_guid === data.type_guid)

		if (index === -1) {
			return null
		}

		const updatedType: AccrualType = {
			...this.data[index],
			type_name: data.type_name,
			ammo_coins_amount: data.ammo_coins_amount
		}

		this.data[index] = updatedType
		return updatedType
	}

	static delete(typeGuid: string): boolean {
		const index = this.data.findIndex((type) => type.type_guid === typeGuid)

		if (index === -1) {
			return false
		}

		this.data.splice(index, 1)

		return true
	}

	static getStats() {
		const stats = {
			total: this.data.length,
			withFixedAmount: this.data.filter((type) => type.ammo_coins_amount !== undefined).length,
			withVariableAmount: this.data.filter((type) => type.ammo_coins_amount === undefined).length
		}

		return stats
	}

	static search(params: {
		searchTerm?: string
		hasFixedAmount?: boolean
		sortOrder?: 'newest' | 'oldest' | 'name_asc' | 'name_desc'
	}): AccrualType[] {
		let filtered = [...this.data]

		if (params.searchTerm) {
			const searchLower = params.searchTerm.toLowerCase()
			filtered = filtered.filter(
				(type) =>
					type.type_name.toLowerCase().includes(searchLower) ||
					type.type_guid.toLowerCase().includes(searchLower)
			)
		}

		if (params.hasFixedAmount !== undefined) {
			if (params.hasFixedAmount) {
				filtered = filtered.filter((type) => type.ammo_coins_amount !== undefined)
			} else {
				filtered = filtered.filter((type) => type.ammo_coins_amount === undefined)
			}
		}

		switch (params.sortOrder) {
			case 'name_asc':
				filtered.sort((a, b) => a.type_name.localeCompare(b.type_name))
				break
			case 'name_desc':
				filtered.sort((a, b) => b.type_name.localeCompare(a.type_name))
				break
			case 'oldest':
				// Для простоты используем порядок в массиве как "старые к новым"
				filtered.sort((a, b) => a.type_guid.localeCompare(b.type_guid))
				break
			case 'newest':
			default:
				// Для простоты используем обратный порядок как "новые к старым"
				filtered.sort((a, b) => b.type_guid.localeCompare(a.type_guid))
				break
		}

		return filtered
	}
}
