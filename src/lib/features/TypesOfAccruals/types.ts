import type { AccrualType } from '$lib/types/shared'

// Реэкспорт общего типа
export type { AccrualType }

// Типы для форм типов начислений
export interface TypeOfAccrualFormData {
	org_guid?: string
	type_name: string
	ammo_coins_amount?: number
}
