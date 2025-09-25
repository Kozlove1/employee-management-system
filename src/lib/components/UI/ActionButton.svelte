<script lang="ts">
	import { Plus } from '@lucide/svelte'

	interface Props {
		onClick: () => void
		disabled?: boolean
		size?: 'sm' | 'md' | 'lg'
		variant?: 'primary' | 'secondary' | 'outline'
		text?: string
		icon?: any // Lucide icon component
		showIcon?: boolean
	}

	let {
		onClick,
		disabled = false,
		size = 'md',
		variant = 'primary',
		text = 'Добавить начисление',
		icon = Plus,
		showIcon = true
	} = $props()

	const sizeClasses: any = {
		sm: 'px-2 sm:px-3 py-1.5 text-xs sm:text-sm min-w-[100px] sm:min-w-[120px]',
		md: 'px-3 sm:px-4 py-2 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]',
		lg: 'px-4 sm:px-6 py-3 text-base sm:text-lg min-w-[180px] sm:min-w-[200px]'
	}

	const iconSizes: any = {
		sm: 'h-2.5 w-2.5 sm:h-3 sm:w-3',
		md: 'h-3.5 w-3.5 sm:h-4 sm:w-4',
		lg: 'h-4 w-4 sm:h-5 sm:w-5'
	}

	const variantClasses: any = {
		primary: 'bg-[#f5e804] text-black hover:bg-[#e6d104] focus:ring-[#f5e804]',
		secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
		outline:
			'bg-transparent text-[#f5e804] border border-[#f5e804] hover:bg-[#f5e804]/10 focus:ring-[#f5e804]'
	}
</script>

<button
	onclick={onClick}
	{disabled}
	class="
    inline-flex max-w-full items-center overflow-hidden
    rounded-lg transition-colors
    duration-200 focus:outline-none
    focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    {sizeClasses[size]}
    {variantClasses[variant]}
  "
>
	{#if showIcon}
		{@const IconComponent = icon}
		<IconComponent class="{iconSizes[size]} mr-2 flex-shrink-0" />
	{/if}
	<span class="truncate whitespace-nowrap">{text}</span>
</button>
