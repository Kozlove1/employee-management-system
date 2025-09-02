<script lang="ts">
  import { CONTAINER_SM } from '$lib/utils';
</script>

<svelte:head>
  <title>Типы начислений | Система АммоКоинов</title>
</svelte:head>

<div class="text-center py-12">
  <h2 class="text-3xl font-bold text-neutral-900 mb-4">💼 Типы начислений</h2>
  <p class="text-neutral-600 mb-8">
    Управление типами и категориями начислений
  </p>
  <div
    class="bg-primary-50 p-8 rounded-lg shadow-sm {CONTAINER_SM} border border-neutral-200"
  >
    <h3 class="text-xl font-semibold mb-4 text-neutral-900">
      Функционал в разработке:
    </h3>
    <ul class="text-left space-y-2 text-neutral-700">
      <li>🔄 Создание новых типов начислений</li>
      <li>🔄 Редактирование существующих типов</li>
      <li>🔄 Настройка правил начисления</li>
      <li>🔄 Управление категориями</li>
    </ul>
  </div>
</div>
