import type { AccrualType } from '$lib/screens/TypesOfAccruals/types'
import { TypesOfAccrualsDataManager } from '$lib/screens/TypesOfAccruals/typesOfAccrualsData'

class AccrualTypesStore {
	private dataVersion = $state<number>(0)

	getDataVersion(): number {
		return this.dataVersion
	}

	types = $derived.by((): AccrualType[] => {
		this.dataVersion // Зависимость для принудительного обновления
		return TypesOfAccrualsDataManager.getAll()
	})

	refresh(): void {
		this.dataVersion++
	}

	getTypeById(typeGuid: string): AccrualType | null {
		return this.types.find((type) => type.type_guid === typeGuid) || null
	}

	getTypesWithFixedAmount(): AccrualType[] {
		return this.types.filter((type) => type.ammo_coins_amount !== undefined)
	}

	getTypesWithVariableAmount(): AccrualType[] {
		return this.types.filter((type) => type.ammo_coins_amount === undefined)
	}
}

export const accrualTypesStore = new AccrualTypesStore()
