<script lang="ts">
  import {
    Award,
    Coins,
    Building2,
    Briefcase,
    Calendar,
    Mail,
    User,
    VenusAndMars,
  } from '@lucide/svelte';

  import type { IconRowProps } from './IconRow.types';

  type Props = IconRowProps;

  let {
    backgroundColor = 'bg-primary-50',
    gapSize = 'm',
    title,
    titleColor = 'text-neutral-500',
    titleSize = 'm',
    icon,
    iconSize = 'm',
  }: Props = $props();

  const icons = {
    award: Award,
    coins: Coins,
    building2: Building2,
    briefcase: Briefcase,
    calendar: Calendar,
    mail: Mail,
    user: User,
    venusAndMars: VenusAndMars,
  };

  const iconSizes = {
    s: 10,
    m: 12,
    l: 16,
  };

  const titleSizes = {
    s: 'text-xs',
    m: 'text-sm',
    l: 'text-base',
  };

  const gapSizes = {
    s: 'gap-1',
    m: 'gap-2',
    l: 'gap-3',
  };

  const backgroundStyles = backgroundColor
    ? `${backgroundColor} rounded-md p-1`
    : '';

  const IconComponent = icons[icon];
</script>

<div>
  <div class="flex items-center {gapSizes[gapSize]} {backgroundStyles}">
    <IconComponent size={iconSizes[iconSize]} />
    {#if title}
      <p class="{titleSizes[titleSize]} {titleColor}">{title}</p>
    {/if}
  </div>
</div>
