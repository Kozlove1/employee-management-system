<script lang="ts">
	import type { AccrualType } from '$lib/types/shared'
	import { ChevronDown, Search, X } from '@lucide/svelte'
	import FormField from './FormField.svelte'

	type Props = {
		value: string
		accrualTypes: AccrualType[]
		required?: boolean
		disabled?: boolean
		placeholder?: string
		error?: string
		onValueChange?: (value: string) => void
	}

	const {
		value,
		accrualTypes,
		required = false,
		disabled = false,
		placeholder = 'Выберите тип начисления',
		error,
		onValueChange
	}: Props = $props()

	let isOpen = $state(false)
	let searchTerm = $state('')
	// biome-ignore lint/style/useConst: bind:this requires let, not const
	let dropdownRef: HTMLDivElement | null = $state(null)

	const selectedType = $derived(accrualTypes.find((type) => type.type_guid === value))

	const filteredTypes = $derived(() => {
		if (!searchTerm) return accrualTypes
		const search = searchTerm.toLowerCase()
		return accrualTypes.filter((type) => type.type_name.toLowerCase().includes(search))
	})

	function getTypeLabel(type: AccrualType): string {
		if (type.ammo_coins_amount && type.ammo_coins_amount > 0) {
			return `${type.type_name} (${type.ammo_coins_amount} АК)`
		}
		return `${type.type_name} (переменная)`
	}

	function handleSelect(typeGuid: string) {
		if (onValueChange) {
			onValueChange(typeGuid)
		}
		isOpen = false
		searchTerm = ''
	}

	function handleClear() {
		if (onValueChange) {
			onValueChange('')
		}
		searchTerm = ''
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false
			searchTerm = ''
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside)
		} else {
			document.removeEventListener('click', handleClickOutside)
		}

		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	})
</script>

<FormField label="Тип начисления" {required} {error} id="accrual-type-select">
	{#snippet children()}
		<div class="relative" bind:this={dropdownRef}>
			<div
				role="button"
				tabindex={disabled ? -1 : 0}
				onclick={() => !disabled && (isOpen = !isOpen)}
				onkeydown={(e) => {
					if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
						e.preventDefault()
						isOpen = !isOpen
					}
				}}
				class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {disabled
					? 'cursor-not-allowed bg-gray-50'
					: 'cursor-pointer'} {error ? 'border-red-300' : ''}"
			>
				<div class="flex items-center justify-between">
					<span class={selectedType ? 'text-gray-900' : 'text-gray-500'}>
						{selectedType ? getTypeLabel(selectedType) : placeholder}
					</span>
					<div class="flex items-center gap-1">
						{#if selectedType && !disabled}
							<button
								type="button"
								onclick={(e) => {
									e.stopPropagation()
									handleClear()
								}}
								class="text-gray-400 hover:text-gray-600"
							>
								<X class="h-4 w-4" />
							</button>
						{/if}
						<ChevronDown
							class="h-4 w-4 text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}"
						/>
					</div>
				</div>
			</div>

			{#if isOpen}
				<div class="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
					<!-- Search input -->
					<div class="border-b border-gray-200 p-2">
						<div class="relative">
							<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								bind:value={searchTerm}
								placeholder="Поиск типа начисления..."
								class="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								onclick={(e) => e.stopPropagation()}
							/>
						</div>
					</div>

					<!-- Types list with scroll -->
					<div class="max-h-60 overflow-y-auto">
						{#if filteredTypes().length === 0}
							<div class="px-3 py-4 text-center text-sm text-gray-500">
								Типы начислений не найдены
							</div>
						{:else}
							{#each filteredTypes() as type}
								<button
									type="button"
									onclick={() => handleSelect(type.type_guid)}
									class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 {type.type_guid ===
									value
										? 'bg-blue-50 text-blue-600'
										: 'text-gray-900'}"
								>
									<div class="flex items-center justify-between">
										<span class="font-medium">{type.type_name}</span>
										<span
											class="text-xs {type.type_guid === value ? 'text-blue-600' : 'text-gray-500'}"
										>
											{#if type.ammo_coins_amount && type.ammo_coins_amount > 0}
												{type.ammo_coins_amount} АК
											{:else}
												Переменная
											{/if}
										</span>
									</div>
								</button>
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/snippet}
</FormField>
