<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  interface Props {
    currentPage: number;
    totalPages: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    showInfo?: boolean;
  }

  let {
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    showInfo = true,
  }: Props = $props();
</script>

{#if totalPages > 1}
  <div class="flex justify-center">
    <div class="flex items-center space-x-2">
      <button
        onclick={onPrevPage}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        class="btn p-2 border border-neutral-300 bg-primary-50 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft class="w-4 h-4" />
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
        class="btn p-2 border border-neutral-300 bg-primary-50 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
{/if}
