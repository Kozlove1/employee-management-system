<script lang="ts">
	// biome-ignore lint/correctness/noUnusedImports: используется в шаблоне
	import { Search, X } from '@lucide/svelte'

	interface Props {
		value: string
		placeholder?: string
		bgColor?: string
		borderColor?: string
		rounded?: string
		ariaLabel?: string
		disabled?: boolean
		onChange: (value: string) => void
		debounceMs?: number
		minLength?: number
		trim?: boolean
		normalize?: boolean
		searchOnEnter?: boolean
	}

	const {
		value,
		// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне
		placeholder = 'Поиск...',
		// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне
		bgColor = 'bg-white',
		// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне
		borderColor = 'border-gray-300',
		// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне
		rounded = 'rounded-lg',
		// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне
		ariaLabel = 'Поиск',
		// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне
		disabled = false,
		onChange,
		debounceMs = 500,
		minLength = 2,
		trim = true,
		normalize = false,
		searchOnEnter = false
	}: Props = $props()

	// biome-ignore lint/style/useConst: bind:this requires let
	let inputRef: HTMLInputElement | null = $state(null)
	let debounceTimer: ReturnType<typeof setTimeout> | null = $state(null)
	let internalValue = $state(value)
	let lastExternalValue = $state(value)

	function normalizeValue(input: string): string {
		let normalized = input
		if (trim) {
			normalized = normalized.trim()
		}
		if (normalize) {
			normalized = normalized.toLowerCase()
		}
		return normalized
	}

	function shouldTriggerSearch(normalizedValue: string): boolean {
		return minLength === 0 || normalizedValue.length >= minLength || normalizedValue.length === 0
	}

	function triggerChange(normalizedValue: string) {
		if (!shouldTriggerSearch(normalizedValue)) {
			return
		}

		if (debounceTimer) {
			clearTimeout(debounceTimer)
		}

		const executeChange = () => {
			onChange(normalizedValue)
			lastExternalValue = normalizedValue
		}

		if (debounceMs > 0) {
			debounceTimer = setTimeout(executeChange, debounceMs)
		} else {
			executeChange()
		}
	}

	// Cleanup timer on unmount
	$effect(() => {
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer)
			}
		}
	})

	// Sync internal value with external value prop (only when changed externally)
	$effect(() => {
		// Only sync if value changed externally (not from our onChange)
		if (value !== lastExternalValue) {
			internalValue = value
			lastExternalValue = value
		}
	})

	function handleClear() {
		internalValue = ''
		lastExternalValue = ''
		if (debounceTimer) {
			clearTimeout(debounceTimer)
		}
		onChange('')
		inputRef?.focus()
	}

	// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне (oninput)
	function handleInput(event: Event) {
		const newValue = (event.target as HTMLInputElement).value
		internalValue = newValue
		const normalized = normalizeValue(newValue)
		triggerChange(normalized)
	}

	// biome-ignore lint/correctness/noUnusedVariables: используется в шаблоне (onkeydown={handleKeyDown})
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && internalValue) {
			handleClear()
			event.preventDefault()
			return
		}

		if (searchOnEnter && event.key === 'Enter') {
			event.preventDefault()
			if (debounceTimer) {
				clearTimeout(debounceTimer)
			}
			const normalized = normalizeValue(internalValue)
			if (shouldTriggerSearch(normalized)) {
				onChange(normalized)
			}
		}
	}
</script>

<div class="relative">
	<Search
		class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
		aria-hidden="true"
	/>
	<input
		bind:this={inputRef}
		type="search"
		{placeholder}
		value={internalValue}
		aria-label={ariaLabel}
		autocomplete="off"
		spellcheck="false"
		{disabled}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		class="w-full border py-2 pl-10 text-sm {internalValue
			? 'pr-8'
			: 'pr-4'} {borderColor} {rounded} placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 {bgColor} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 [&::-ms-clear]:hidden [&::-webkit-search-cancel-button]:hidden"
	/>
	{#if internalValue && !disabled}
		<button
			type="button"
			onclick={handleClear}
			class="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform rounded text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
			aria-label="Очистить поиск"
			tabindex="0"
		>
			<X class="h-4 w-4" />
		</button>
	{/if}
</div>
