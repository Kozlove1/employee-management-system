<script lang="ts">
	import { departmentsStore } from '$lib/stores/departmentsStore.svelte'
	import { ChevronDown, Search, X } from '@lucide/svelte'

	interface Props {
		value: string
		bgColor?: string
		dropdownWidth?: string
		disabled?: boolean
		onChange: (value: string) => void
		fullWidth?: boolean
		widthClass?: string
	}

	const {
		value,
		bgColor = 'bg-white',
		dropdownWidth = 'min-w-80',
		disabled = false,
		onChange,
		fullWidth = false,
		widthClass = 'w-48'
	}: Props = $props()

	const containerClass = fullWidth ? 'w-full' : widthClass

	let isOpen = $state(false)
	let searchTerm = $state('')
	// biome-ignore lint/style/useConst: bind:this requires let, not const
	let dropdownRef: HTMLDivElement | null = $state(null)
	// biome-ignore lint/style/useConst: bind:this requires let, not const
	let dropdownMenuRef: HTMLDivElement | null = $state(null)
	// biome-ignore lint/style/useConst: bind:this requires let, not const
	let buttonRef: HTMLDivElement | null = $state(null)
	
	let dropdownPosition = $state<'bottom' | 'top'>('bottom')
	let dropdownLeft = $state<number | null>(null)
	let isPositionCalculated = $state(false)

	const departments = $derived(departmentsStore.getDepartments())
	const isLoading = $derived(departmentsStore.getIsLoading())

	const options = $derived([
		{ value: '', label: 'Все подразделения' },
		...departments.map((dept) => ({
			value: dept.id,
			label: dept.department
		}))
	])

	const selectedOption = $derived(options.find((opt) => opt.value === value))

	function calculateDropdownPosition() {
		if (!buttonRef || !dropdownMenuRef) {
			isPositionCalculated = false
			return
		}
		
		const buttonRect = buttonRef.getBoundingClientRect()
		const dropdownRect = dropdownMenuRef.getBoundingClientRect()
		const viewportHeight = window.innerHeight
		const viewportWidth = window.innerWidth
		
		// Проверяем, есть ли место внизу
		const spaceBelow = viewportHeight - buttonRect.bottom
		const spaceAbove = buttonRect.top
		
		// Определяем вертикальную позицию
		if (spaceBelow < dropdownRect.height && spaceAbove > spaceBelow) {
			dropdownPosition = 'top'
		} else {
			dropdownPosition = 'bottom'
		}
		
		// Определяем горизонтальную позицию
		const dropdownWidth = dropdownRect.width || buttonRect.width
		const centerX = buttonRect.left + buttonRect.width / 2
		
		// Если dropdown шире кнопки, центрируем относительно кнопки
		if (dropdownWidth > buttonRect.width) {
			const leftEdge = centerX - dropdownWidth / 2
			const rightEdge = centerX + dropdownWidth / 2
			
			// Если выходит за правый край
			if (rightEdge > viewportWidth) {
				dropdownLeft = viewportWidth - dropdownWidth - 8 // 8px отступ от края
			}
			// Если выходит за левый край
			else if (leftEdge < 0) {
				dropdownLeft = 8 // 8px отступ от края
			}
			// Центрируем
			else {
				dropdownLeft = null // Используем CSS центрирование
			}
		} else {
			dropdownLeft = null
		}
		
		isPositionCalculated = true
	}
	
	function toggleDropdown() {
		if (disabled) return
		isOpen = !isOpen
		if (isOpen) {
			searchTerm = ''
			isPositionCalculated = false
			// При открытии загружаем все департаменты, если список пуст
			if (departments.length === 0) {
				departmentsStore.initialize()
			}
			// Используем requestAnimationFrame для расчета позиции после рендера
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					calculateDropdownPosition()
				})
			})
		} else {
			isPositionCalculated = false
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

	function handleSearchInput(e: Event) {
		const input = e.target as HTMLInputElement
		const value = input.value
		searchTerm = value
		// Вызываем поиск через API (если пусто, загружаются все департаменты)
		departmentsStore.searchDepartments(value)
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
			window.addEventListener('resize', calculateDropdownPosition)
			window.addEventListener('scroll', calculateDropdownPosition, true)
			
			return () => {
				document.removeEventListener('click', handleClickOutside)
				window.removeEventListener('resize', calculateDropdownPosition)
				window.removeEventListener('scroll', calculateDropdownPosition, true)
			}
		}
	})
</script>

<div class="relative {containerClass} flex-shrink-0" bind:this={dropdownRef}>
	<!-- Кнопка выбора -->
	<div
		role="button"
		tabindex="0"
		bind:this={buttonRef}
		onclick={toggleDropdown}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				toggleDropdown()
			}
		}}
		class="w-full rounded-md border border-neutral-300 px-3 py-2 text-left text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {bgColor} flex items-center justify-between shadow-sm transition-colors {disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer hover:bg-neutral-50'}"
		title={selectedOption?.label}
	>
		<span class="block flex-1 truncate">
			{selectedOption?.label || 'Выберите подразделение...'}
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
			bind:this={dropdownMenuRef}
			class="absolute z-50 {dropdownWidth} rounded-md border border-neutral-300 bg-white shadow-lg {dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} {dropdownLeft !== null ? '' : 'left-1/2 -translate-x-1/2'} {isPositionCalculated ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
			style={dropdownLeft !== null ? `left: ${dropdownLeft}px; transform: none;` : ''}
		>
			<!-- Поле поиска -->
			<div class="border-b border-neutral-200 p-2">
				<div class="relative">
					<Search class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						type="text"
						value={searchTerm}
						oninput={handleSearchInput}
						placeholder="Поиск..."
						class="w-full rounded border border-neutral-300 py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						onclick={(e) => e.stopPropagation()}
					/>
				</div>
			</div>

			<!-- Список опций -->
			<div class="max-h-60 overflow-y-auto">
				{#if isLoading}
					<div class="px-3 py-2 text-center text-sm text-neutral-500">Загрузка...</div>
				{:else if options.length === 0}
					<div class="px-3 py-2 text-center text-sm text-neutral-500">Ничего не найдено</div>
				{:else}
					{#each options as option (option.value)}
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
