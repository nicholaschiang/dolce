<script lang="ts">
  import { ChevronRight, Library } from "lucide-svelte"

  let { children } = $props()
</script>

<header
  class="sticky top-0 z-10 flex h-10 items-center gap-2 border-b border-gray-200 bg-white/80 px-6 text-lg lowercase tracking-tighter backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80"
>
  <a href="/"><Library class="h-4 w-4" /></a>
  <ChevronRight class="h-4 w-4 text-gray-200 dark:text-gray-800" />
  {@render children()}
</header>
