<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/accruals', { replaceState: true });
  });
</script>

<div class="text-center py-12">
  <h2 class="text-3xl font-bold text-neutral-900 mb-4">
    🏆 Система АммоКоинов
  </h2>
  <p class="text-neutral-600">Загрузка...</p>
</div>
