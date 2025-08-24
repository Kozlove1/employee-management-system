<script lang="ts">
  import { Search, Building2, Briefcase, Users } from '@lucide/svelte';
  import {
    mockPositions,
    mockDepartments,
    mockEmployees,
    getDepartmentName,
  } from '$lib/data/mockData';

  import type { Position } from '$lib/types';

  let searchTerm = $state('');
  let selectedDepartment = $state('');

  let filteredPositions = $derived(() => {
    return mockPositions.filter((position) => {
      const matchesSearch =
        !searchTerm ||
        position.position_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        !selectedDepartment || position.department_guid === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  });

  // Группируем должности по подразделениям
  let positionsByDepartment = $derived(() => {
    const grouped = new Map<string, Position[]>();

    filteredPositions().forEach((position) => {
      const deptGuid = position.department_guid;
      if (!grouped.has(deptGuid)) {
        grouped.set(deptGuid, []);
      }
      grouped.get(deptGuid)!.push(position);
    });

    return grouped;
  });

  function getEmployeeCountForPosition(positionGuid: string): number {
    // В реальном приложении здесь была бы связь должности с сотрудниками
    return Math.floor(Math.random() * 5) + 1;
  }

  function resetFilters() {
    searchTerm = '';
    selectedDepartment = '';
  }
</script>

<div class="space-y-6">
  <!-- Заголовок -->
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  >
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">Должности</h1>
      <p class="mt-1 text-sm text-neutral-500">
        Справочник должностей по подразделениям
      </p>
    </div>

    <div class="flex items-center space-x-4 text-sm">
      <div class="bg-info-50 px-3 py-2 rounded-lg">
        <span class="text-info-600 font-medium">Всего должностей:</span>
        <span class="text-info-900 font-bold ml-1">{mockPositions.length}</span>
      </div>
      <div class="bg-success-50 px-3 py-2 rounded-lg">
        <span class="text-success-600 font-medium">Подразделений:</span>
        <span class="text-success-900 font-bold ml-1"
          >{mockDepartments.length}</span
        >
      </div>
    </div>
  </div>

  <!-- Фильтры -->
  <div class="card p-4">
    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
      <div class="flex-1">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4"
          />
          <input
            type="text"
            placeholder="Поиск по названию должности..."
            bind:value={searchTerm}
            class="input pl-10"
          />
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <select bind:value={selectedDepartment} class="select min-w-[250px]">
          <option value="">Все подразделения ({mockDepartments.length})</option>
          {#each mockDepartments as dept}
            <option value={dept.department_guid}>{dept.department}</option>
          {/each}
        </select>

        <button class="btn-secondary" onclick={resetFilters}> Сбросить </button>
      </div>
    </div>
  </div>

  <!-- Результаты поиска -->
  {#if filteredPositions.length > 0}
    <div class="bg-neutral-100 px-4 py-3 rounded-lg">
      <div class="text-sm text-neutral-600">
        Найдено: <span class="font-semibold"
          >{filteredPositions.length} должностей</span
        >
        {#if filteredPositions.length !== mockPositions.length}
          (отфильтровано из {mockPositions.length})
        {/if}
      </div>
    </div>
  {/if}

  <!-- Должности по подразделениям -->
  <div class="space-y-6">
    {#each Array.from(positionsByDepartment().entries()) as [departmentGuid, positions]}
      <div class="card">
        <!-- Заголовок подразделения -->
        <div class="px-6 py-4 border-b border-neutral-200 bg-neutral-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <Building2 class="h-5 w-5 text-neutral-400" />
              <h3 class="text-lg font-medium text-neutral-900">
                {getDepartmentName(departmentGuid)}
              </h3>
            </div>
            <span class="text-sm text-neutral-500">
              {positions.length} должностей
            </span>
          </div>
        </div>

        <!-- Список должностей -->
        <div class="divide-y divide-neutral-200">
          {#each positions as position}
            <div class="px-6 py-4 hover:bg-neutral-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div
                      class="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center"
                    >
                      <Briefcase class="h-5 w-5 text-info-600" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-neutral-900">
                      {position.position_name}
                    </h4>
                    <p class="text-sm text-neutral-500">
                      ID: {position.position_guid}
                    </p>
                  </div>
                </div>

                <div class="flex items-center space-x-4 text-sm">
                  <div class="flex items-center text-neutral-500">
                    <Users class="h-4 w-4 mr-1" />
                    <span
                      >{getEmployeeCountForPosition(position.position_guid)} сотр.</span
                    >
                  </div>

                  <button
                    class="btn text-info-600 hover:text-info-900 font-medium"
                  >
                    Просмотр
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  {#if filteredPositions.length === 0}
    <div class="text-center py-12">
      <div class="text-neutral-400 text-lg mb-2">💼</div>
      <h3 class="text-lg font-medium text-neutral-900 mb-1">
        Должности не найдены
      </h3>
      <p class="text-neutral-500">
        {#if searchTerm || selectedDepartment}
          Попробуйте изменить фильтры поиска
        {:else}
          Список должностей пуст
        {/if}
      </p>
    </div>
  {/if}
</div>
