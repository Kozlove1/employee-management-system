<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    isOpen: boolean;
    title: string;
    subtitle?: string;
    onClose?: () => void;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    children?: Snippet;
    footer?: Snippet;
  };

  let {
    isOpen = $bindable(false),
    title,
    subtitle,
    onClose,
    maxWidth = 'md',
    children,
    footer,
  }: Props = $props();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  function handleClose() {
    if (onClose) {
      onClose();
    }
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleBackdropKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
  >
    <div
      class="bg-white rounded-lg shadow-xl {maxWidthClasses[
        maxWidth
      ]} w-full max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
      >
        <div>
          <h3 id="modal-title" class="text-lg font-medium text-gray-900">
            {title}
          </h3>
          {#if subtitle}
            <p class="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          {/if}
        </div>
        {#if onClose}
          <button
            class="text-gray-400 hover:text-gray-500 transition-colors"
            onclick={handleClose}
            aria-label="Закрыть модальное окно"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        {/if}
      </div>

      <!-- Body -->
      <div class="px-6 py-4">
        {#if children}
          {@render children()}
        {/if}
      </div>

      <!-- Footer -->
      {#if footer}
        <div class="px-6 py-4 border-t border-gray-200">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
