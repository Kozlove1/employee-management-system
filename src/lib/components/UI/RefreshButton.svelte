<script lang="ts">
	import { RefreshCw } from '@lucide/svelte'

	interface Props {
		onClick: () => void
		isLoading?: boolean
		disabled?: boolean
		text?: string
		loadingText?: string
		variant?: 'primary' | 'info'
	}

	let {
		onClick,
		isLoading = false,
		disabled = false,
		text = 'Обновить',
		loadingText = 'Загрузка...',
		variant = 'primary'
	}: Props = $props()

	const buttonClasses = {
		primary: 'bg-primary-500 hover:bg-primary-600 text-white',
		info: 'bg-info-500 hover:bg-info-600 text-primary-50'
	}
</script>

<button
	onclick={onClick}
	disabled={disabled || isLoading}
	class="btn flex items-center gap-2 rounded-lg px-3 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 {buttonClasses[
		variant
	]}"
>
	<RefreshCw class="h-4 w-4 {isLoading ? 'animate-spin' : ''}" />
	<span>{isLoading ? loadingText : text}</span>
</button>
