<script>
  import SimpleNavbar from '$lib/components/Layout/SimpleNavbar.svelte';
  import { getAppContainerStyle } from '$lib/utils';
  import '../app.css';

  const props = $props();
  const children = props.children;
</script>

<div class="min-h-screen bg-neutral-50">
  <SimpleNavbar />

  <main class={getAppContainerStyle('py-6')}>
    {@render children()}
  </main>
</div>
