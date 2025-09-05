<script lang="ts">
	import { Search } from '@lucide/svelte'

	interface Props {
		value: string
		placeholder?: string
		bgColor?: string
		borderColor?: string
		rounded?: string
		onChange: (value: string) => void
	}

	let {
		value,
		placeholder = 'Поиск...',
		bgColor = 'bg-white',
		borderColor = 'border-gray-300',
		rounded = 'rounded-lg',
		onChange
	} = $props()
</script>

<div class="relative">
	<Search class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
	<input
		type="text"
		{placeholder}
		{value}
		oninput={(e) => onChange((e.target as HTMLInputElement).value)}
		class="w-full border py-2 pl-8 pr-4 {borderColor} {rounded} placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {bgColor}"
	/>
</div>
