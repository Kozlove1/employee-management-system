<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
		className?: string
	}

	let { size = 'md', className = '' }: Props = $props()

	const sizeClasses = {
		sm: 'w-24',
		md: 'w-28',
		lg: 'w-32',
		xl: 'w-40',
		xxl: 'w-44'
	}

	const imageSize = sizeClasses[size]
</script>

<div class="flex items-center justify-center {className}">
	<img src="/logo/аммоний.png" alt="Логотип Аммоний" class="{imageSize} object-contain" />
</div>
