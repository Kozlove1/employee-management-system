import type { AccrualType } from '$lib/types/shared'
import { TypesOfAccrualsDataManager } from '../mocks/typesOfAccrualsData'

class AccrualTypesStore {
	private dataVersion = $state<number>(0)

	public getDataVersion(): number {
		return this.dataVersion
	}

	types = $derived.by((): AccrualType[] => {
		this.dataVersion // Зависимость для принудительного обновления
		return TypesOfAccrualsDataManager.getAll()
	})

	refresh(): void {
		this.dataVersion++
	}

	public getTypeById(typeGuid: string): AccrualType | null {
		return this.types.find((type) => type.type_guid === typeGuid) || null
	}

	public getTypesWithFixedAmount(): AccrualType[] {
		return this.types.filter((type) => type.ammo_coins_amount !== undefined)
	}

	public getTypesWithVariableAmount(): AccrualType[] {
		return this.types.filter((type) => type.ammo_coins_amount === undefined)
	}
}

export const accrualTypesStore = new AccrualTypesStore()
