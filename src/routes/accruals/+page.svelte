<script lang="ts">
  import { CONTAINER_SM } from '$lib/utils';
</script>

<svelte:head>
  <title>Начисления | Система АммоКоинов</title>
</svelte:head>

<div class="text-center py-12">
  <h2 class="text-3xl font-bold text-neutral-900 mb-4">
    🏆 Начисления АммоКоинов
  </h2>
  <p class="text-neutral-600 mb-8">
    Система управления бонусными начислениями сотрудникам
  </p>
  <div
    class="bg-primary-50 p-8 rounded-lg shadow-sm {CONTAINER_SM} border border-neutral-200"
  >
    <h3 class="text-xl font-semibold mb-4 text-neutral-900">
      Основные функции:
    </h3>
    <ul class="text-left space-y-2 text-neutral-700">
      <li>✅ Просмотр всех начислений с фильтрацией</li>
      <li>✅ Форма добавления новых начислений</li>
      <li>✅ Поиск по сотрудникам и типам начислений</li>
      <li>✅ Статистика по начислениям</li>
    </ul>
  </div>
</div>
