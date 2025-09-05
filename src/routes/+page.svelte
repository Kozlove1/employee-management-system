<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	onMount(() => {
		goto('/accruals', { replaceState: true })
	})
</script>

<div class="py-12 text-center">
	<h2 class="mb-4 text-3xl font-bold text-neutral-900">🏆 Система АммоКоинов</h2>
	<p class="text-neutral-600">Загрузка...</p>
</div>
