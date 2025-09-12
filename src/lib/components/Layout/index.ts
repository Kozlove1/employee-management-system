import type { IconName } from '../UI/IconRow.svelte'

export enum MenuItemEnum {
	ACCRUALS = '/accruals',
	EMPLOYEES = '/employees',
	TYPES_OF_ACCRUALS = '/typesOfAccruals',
	STATISTICS = '/statistics'
}

export type MenuItem = {
	id: string
	label: string
	icon: IconName
	href: MenuItemEnum
}
