<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    id?: string;
    children: Snippet;
  };

  let { label, required = false, hint, error, id, children }: Props = $props();
</script>

<div class="space-y-1">
  <label for={id} class="block text-sm font-medium text-gray-700">
    {label}
    {#if required}
      <span class="text-red-500">*</span>
    {/if}
    {#if hint}
      <span class="text-xs text-blue-700 ml-1 font-medium">
        {hint}
      </span>
    {/if}
  </label>

  {@render children()}

  {#if error}
    <p class="text-xs text-red-600 mt-1">
      {error}
    </p>
  {/if}
</div>
