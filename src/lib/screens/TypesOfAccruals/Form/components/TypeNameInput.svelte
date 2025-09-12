<script lang="ts">
	import FormField from './FormField.svelte'

	interface Props {
		value: string
		onValueChange: (value: string) => void
		required?: boolean
		error?: string
	}

	let { value, onValueChange, required = false, error }: Props = $props()
</script>

<FormField label="Название типа начисления" {required} {error}>
	<input
		type="text"
		{value}
		oninput={(e) => onValueChange((e.target as HTMLInputElement).value)}
		placeholder="Введите название типа начисления"
		class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
		class:border-red-300={error}
		class:focus:ring-red-500={error}
		class:focus:border-red-500={error}
	/>
</FormField>
