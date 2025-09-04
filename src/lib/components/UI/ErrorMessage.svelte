<script lang="ts">
  import { RefreshCw, TriangleAlert, X } from '@lucide/svelte';

  interface Props {
    message?: string;
    title?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    showRetry?: boolean;
    showDismiss?: boolean;
  }

  let {
    message = 'Произошла ошибка',
    title = 'Ошибка загрузки',
    onRetry,
    onDismiss,
    showRetry = true,
    showDismiss = true,
  }: Props = $props();
</script>

<div class="text-center py-6">
  <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
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
                class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X class="h-4 w-4 mr-1" />
                Скрыть
              </button>
            {/if}

            {#if showRetry && onRetry}
              <button
                type="button"
                onclick={onRetry}
                class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw class="h-4 w-4 mr-1" />
                Попробовать снова
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
