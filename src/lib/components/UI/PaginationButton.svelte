<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte'

	interface Props {
		currentPage: number
		totalPages: number
		onPrevPage: () => void
		onNextPage: () => void
		showInfo?: boolean
	}

	let { currentPage, totalPages, onPrevPage, onNextPage, showInfo = true }: Props = $props()
</script>

{#if totalPages > 1}
	<div class="flex justify-center">
		<div class="flex items-center space-x-2">
			<button
				onclick={onPrevPage}
				disabled={currentPage === 1}
				aria-label="Предыдущая страница"
				class="btn border border-neutral-300 bg-primary-50 p-2 text-neutral-500 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ChevronLeft class="h-4 w-4" />
			</button>

			{#if showInfo}
				<span class="text-sm text-neutral-700">
					{currentPage} / {totalPages}
				</span>
			{/if}

			<button
				onclick={onNextPage}
				disabled={currentPage === totalPages}
				aria-label="Следующая страница"
				class="btn border border-neutral-300 bg-primary-50 p-2 text-neutral-500 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ChevronRight class="h-4 w-4" />
			</button>
		</div>
	</div>
{/if}
