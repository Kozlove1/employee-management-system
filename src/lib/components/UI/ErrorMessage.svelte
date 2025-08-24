<script lang="ts">
  let { message = 'Произошла ошибка', title = 'Ошибка загрузки' } = $props();
</script>

<div class="text-center py-12">
  <div
    class="bg-danger-50 border border-danger-200 rounded-lg p-4 max-w-md mx-auto"
  >
    <p class="text-danger-800">{title}: {message}</p>
  </div>
</div>
