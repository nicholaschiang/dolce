<script lang="ts">
  import { Library } from "lucide-svelte"

  import Link from "$lib/components/Link.svelte"
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-4">
  <Library class="h-8 w-8" />
  <div class="flex flex-col items-center gap-1 lowercase tracking-tighter">
    <Link href="/collections">Collections</Link>
    <Link href="/products">Products</Link>
    <Link
      href="https://github.com/nicholaschiang/dolce/tree/main/svelte-ui"
      target="_blank"
      rel="noopener noreferrer">Source</Link
    >
  </div>
</div>
