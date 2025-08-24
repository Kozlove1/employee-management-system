<script lang="ts">
  import {
    Award,
    Coins,
    ChartNoAxesCombined,
    Building2,
    Briefcase,
    Calendar,
    Mail,
    User,
    VenusAndMars,
    Menu,
  } from '@lucide/svelte';

  export type IconName =
    | 'award'
    | 'coins'
    | 'chart'
    | 'building'
    | 'briefcase'
    | 'calendar'
    | 'mail'
    | 'user'
    | 'venus-and-mars'
    | 'menu';

  type Props = {
    backgroundColor?: string;
    gapSize?: 's' | 'm' | 'l';
    title?: string;
    titleColor?: string;
    titleSize?: 's' | 'm' | 'l';
    icon: IconName;
    iconSize?: 's' | 'm' | 'l';
    hoverColor?: string;
  };

  let {
    backgroundColor = 'bg-primary-50',
    gapSize = 'm',
    title,
    titleColor = 'text-neutral-500',
    titleSize = 'm',
    icon,
    iconSize = 'm',
    hoverColor = 'text-neutral-700',
  }: Props = $props();

  const icons = {
    award: Award,
    coins: Coins,
    chart: ChartNoAxesCombined,
    building: Building2,
    briefcase: Briefcase,
    calendar: Calendar,
    mail: Mail,
    user: User,
    'venus-and-mars': VenusAndMars,
    menu: Menu,
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
    <IconComponent
      size={iconSizes[iconSize]}
      class="{titleColor} group-hover:{hoverColor}"
    />
    {#if title}
      <p class="{titleSizes[titleSize]} {titleColor} group-hover:{hoverColor}">
        {title}
      </p>
    {/if}
  </div>
</div>
