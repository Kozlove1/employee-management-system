<script lang="ts">
	import FormField from './FormField.svelte'

	type Props = {
		value: string
		required?: boolean
		disabled?: boolean
		label?: string
		error?: string
		onValueChange?: (value: string) => void
	}

	const {
		value,
		required = false,
		disabled = false,
		label = 'Дата',
		error,
		onValueChange
	}: Props = $props()

	// Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
	const localValue = $derived.by(() => {
		if (!value) return ''
		try {
			const date = new Date(value)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			return `${year}-${month}-${day}T${hours}:${minutes}`
		} catch (error) {
			console.error('DateTimeInput: Error converting date', error)
			return value
		}
	})

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement

		if (onValueChange && target.value) {
			// Convert datetime-local format to ISO string
			const date = new Date(target.value)
			onValueChange(date.toISOString())
		}
	}
</script>

<FormField {label} {required} {error} id="datetime-input">
	{#snippet children()}
		<div class="relative">
			<input
				id="datetime-input"
				type="datetime-local"
				value={localValue}
				{required}
				{disabled}
				oninput={handleInput}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 {error
					? 'border-red-300'
					: ''}"
			/>
		</div>
	{/snippet}
</FormField>
