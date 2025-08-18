<script lang="ts">
  import { X } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  type Props = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children?: Snippet;
    footer?: Snippet;
  };

  let {
    isOpen = false,
    onClose,
    title = '',
    size = 'md',
    children,
    footer,
  }: Props = $props();

  // Размеры модалки
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Закрытие по Escape
  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <!-- Overlay -->
  <div
    role="button"
    tabindex="0"
    class="fixed inset-0 z-50 overflow-y-auto"
    onclick={onClose}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ' ? onClose() : null)}
    aria-label="Закрыть модалку"
  >
    <!-- Background -->
    <div class="absolute inset-0 bg-gray-500 opacity-75" transition:fade></div>

    <!-- Modal container for centering -->
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Modal content -->
      <div
        class="relative z-10 w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all {sizeClasses[
          size
        ]}"
        onclick={(e) => e.stopPropagation()}
        transition:scale={{ duration: 200 }}
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-200"
        >
          {#if title}
            <h3 id="modal-title" class="text-lg font-medium text-gray-900">
              {title}
            </h3>
          {:else}
            <div></div>
          {/if}

          <button
            onclick={onClose}
            class="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={24} />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          {@render children?.()}
        </div>

        <!-- Footer -->
        {#if footer}
          <div
            class="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
          >
            {@render footer?.()}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
