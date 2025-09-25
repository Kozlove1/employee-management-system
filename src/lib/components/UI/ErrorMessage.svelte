<script lang="ts">
	import { RefreshCw, TriangleAlert, X } from '@lucide/svelte'

	interface Props {
		message?: string
		title?: string
		onRetry?: () => void
		onDismiss?: () => void
		showRetry?: boolean
		showDismiss?: boolean
	}

	let {
		message = 'Произошла ошибка',
		title = 'Ошибка загрузки',
		onRetry,
		onDismiss,
		showRetry = true,
		showDismiss = true
	}: Props = $props()
</script>

<div class="pb-3 text-center">
	<div class="mx-auto max-w-lg rounded-lg border border-red-200 bg-red-50 p-4">
		<div class="flex items-start space-x-3">
			<div class="flex-shrink-0">
				<TriangleAlert class="h-6 w-6 text-red-600" />
			</div>
			<div class="flex-1 text-left">
				<h3 class="text-sm font-medium text-red-800">{title}</h3>
				<p class="mt-1 text-sm text-red-700">{message}</p>

				{#if showRetry || showDismiss}
					<div class="mt-4 flex justify-end space-x-2">
						{#if showDismiss && onDismiss}
							<button
								type="button"
								onclick={onDismiss}
								class="inline-flex items-center rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium leading-4 text-red-700 shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							>
								<X class="mr-1 h-4 w-4" />
								Скрыть
							</button>
						{/if}

						{#if showRetry && onRetry}
							<button
								type="button"
								onclick={onRetry}
								class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							>
								<RefreshCw class="mr-1 h-4 w-4" />
								Попробовать снова
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
