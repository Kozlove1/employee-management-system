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

	let {
		value,
		required = false,
		disabled = false,
		label = 'Дата',
		error,
		onValueChange
	}: Props = $props()

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement
		if (onValueChange) {
			onValueChange(target.value)
		}
	}
</script>

<FormField {label} {required} {error} id="datetime-input">
	{#snippet children()}
		<div class="relative">
			<input
				id="datetime-input"
				type="datetime-local"
				{value}
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
