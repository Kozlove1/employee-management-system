<script lang="ts">
	import { ChevronDown, Search, X } from '@lucide/svelte'

	interface Option {
		value: string
		label: string
	}

	interface Props {
		value: string
		options: Option[]
		minWidth?: string
		maxWidth?: string
		bgColor?: string
		placeholder?: string
		dropdownWidth?: string // Ширина выпадающего списка (например, 'min-w-80' или 'w-96')
		onChange: (value: string) => void
	}

	const {
		value,
		options,
		minWidth = '',
		maxWidth = '',
		bgColor = 'bg-white',
		placeholder = 'Выберите...',
		dropdownWidth = '', // По умолчанию равна ширине кнопки
		onChange
	}: Props = $props()

	let isOpen = $state(false)
	let searchTerm = $state('')
	let dropdownRef: HTMLDivElement | null = $state(null)

	// Фильтрация опций по поисковому запросу
	const filteredOptions = $derived(
		searchTerm.trim()
			? options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
			: options
	)

	// Текущая выбранная опция
	const selectedOption = $derived(options.find((opt) => opt.value === value))

	function toggleDropdown() {
		isOpen = !isOpen
		if (isOpen) {
			searchTerm = ''
		}
	}

	function selectOption(optionValue: string) {
		onChange(optionValue)
		isOpen = false
		searchTerm = ''
	}

	function clearSelection(e: Event) {
		e.stopPropagation()
		onChange('')
		isOpen = false
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
			return () => {
				document.removeEventListener('click', handleClickOutside)
			}
		}
	})
</script>

<div class="relative {minWidth} {maxWidth}" bind:this={dropdownRef}>
	<!-- Кнопка выбора -->
	<div
		role="button"
		tabindex="0"
		onclick={toggleDropdown}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				toggleDropdown()
			}
		}}
		class="w-full rounded-md border border-neutral-300 px-3 py-2 text-left text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {bgColor} flex cursor-pointer items-center justify-between shadow-sm transition-colors hover:bg-neutral-50"
		title={selectedOption?.label}
	>
		<span class="block flex-1 truncate">
			{selectedOption?.label || placeholder}
		</span>
		<div class="ml-2 flex items-center gap-1">
			{#if value && selectedOption}
				<button
					type="button"
					onclick={clearSelection}
					class="rounded p-0.5 transition-colors hover:bg-neutral-200"
					title="Очистить"
				>
					<X class="h-3.5 w-3.5 text-neutral-500" />
				</button>
			{/if}
			<ChevronDown
				class="h-4 w-4 text-neutral-500 transition-transform {isOpen ? 'rotate-180' : ''}"
			/>
		</div>
	</div>

	<!-- Выпадающий список -->
	{#if isOpen}
		<div
			class="absolute z-50 {dropdownWidth ||
				'w-full'} mt-1 rounded-md border border-neutral-300 bg-white shadow-lg {dropdownWidth
				? 'left-1/2 -translate-x-1/2'
				: ''}"
		>
			<!-- Поле поиска -->
			{#if options.length > 5}
				<div class="border-b border-neutral-200 p-2">
					<div class="relative">
						<Search class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
						<input
							type="text"
							bind:value={searchTerm}
							placeholder="Поиск..."
							class="w-full rounded border border-neutral-300 py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							onclick={(e) => e.stopPropagation()}
						/>
					</div>
				</div>
			{/if}

			<!-- Список опций -->
			<div class="max-h-60 overflow-y-auto">
				{#if filteredOptions.length === 0}
					<div class="px-3 py-2 text-center text-sm text-neutral-500">Ничего не найдено</div>
				{:else}
					{#each filteredOptions as option (option.value)}
						<button
							type="button"
							onclick={() => selectOption(option.value)}
							class="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100 {option.value ===
							value
								? 'bg-blue-50 font-medium text-blue-700'
								: 'text-neutral-700'}"
							title={option.label}
						>
							<span class="block truncate">{option.label}</span>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
