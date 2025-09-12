<script lang="ts">
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
		onChange: (value: string) => void
	}

	let { value, options, minWidth = '', maxWidth = '', bgColor = 'bg-white', onChange } = $props()
</script>

<select
	{value}
	onchange={(e) => onChange((e.target as HTMLSelectElement).value)}
	class="w-full rounded-md border border-neutral-300 px-3 py-2 pr-8 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {minWidth} {maxWidth} appearance-none truncate text-sm {bgColor} shadow-sm"
	style="text-overflow: ellipsis;"
	title={options.find((opt: Option) => opt.value === value)?.label}
>
	{#each options as option}
		<option value={option.value} class="truncate">{option.label}</option>
	{/each}
</select>

<style>
	select {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	select option {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
