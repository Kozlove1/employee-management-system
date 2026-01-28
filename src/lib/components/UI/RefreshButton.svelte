<script lang="ts">
	import { RefreshCw } from '@lucide/svelte'

	interface Props {
		onClick: () => void
		isLoading?: boolean
		disabled?: boolean
		text?: string
		loadingText?: string
		variant?: 'primary' | 'info'
		fullWidth?: boolean
	}

	let {
		onClick,
		isLoading = false,
		disabled = false,
		text = 'Обновить',
		loadingText = 'Загрузка...',
		variant = 'primary',
		fullWidth = false
	}: Props = $props()

	const buttonClasses = {
		primary: 'bg-primary-500 hover:bg-primary-600 text-white',
		info: 'bg-info-500 hover:bg-info-600 text-primary-50'
	}
</script>

<button
	onclick={onClick}
	disabled={disabled || isLoading}
	class="btn flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 {buttonClasses[
		variant
	]} {fullWidth ? 'w-full' : ''}"
>
	<RefreshCw class="h-4 w-4 {isLoading ? 'animate-spin' : ''}" />
	<span>{isLoading ? loadingText : text}</span>
</button>
