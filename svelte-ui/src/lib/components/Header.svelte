<script lang="ts">
  let { children } = $props()
</script>
<header
  class="flex h-10 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-800 text-lg lowercase sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl z-10"
>
  {@render children()}
</header>
