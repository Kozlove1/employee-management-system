<script lang="ts">
  import IconRow from './IconRow.svelte';

  type Props = {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color?: 'blue' | 'yellow' | 'green' | 'gray';
  };

  let { title, value, subtitle, icon, color = 'blue' }: Props = $props();

  const colorClasses = {
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    green: 'bg-green-100',
    gray: 'bg-gray-100',
  };

  const iconMapping = {
    users: 'user',
    calendar: 'calendar',
    tags: 'tags',
    wallet: 'coins',
  };
</script>

<div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
  <div class="flex items-center">
    <div class="flex-shrink-0 mr-4">
      <div class="p-2 rounded-lg {colorClasses[color]}">
        <IconRow
          icon={iconMapping[icon]}
          iconSize="l"
          iconColor="black"
          backgroundColor={colorClasses[color]}
        />
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">{title}</p>
      <p class="text-2xl font-bold text-gray-900">{value}</p>
      <p class="text-xs text-gray-500 truncate">{subtitle}</p>
    </div>
  </div>
</div>
