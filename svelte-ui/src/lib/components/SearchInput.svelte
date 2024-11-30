<script lang="ts">
  import { Search } from "lucide-svelte"
  import { PARAM } from "$lib/constants"

  let { defaultSearch = "" }: { defaultSearch?: string } = $props()
  let form: HTMLFormElement
  let value = $state("")

  $effect(() => {
    value =
      new URLSearchParams(window.location.search).get(PARAM) ?? defaultSearch
  })
</script>

<form
  data-sveltekit-replacestate
  data-sveltekit-keepfocus
  bind:this={form}
  class="flex h-10 items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 dark:border-gray-800 dark:bg-gray-900"
>
  <Search class="h-4 w-4" />
  <input
    name={PARAM}
    type="search"
    class="w-0 grow border-0 bg-transparent px-0 text-base tracking-tighter focus:ring-0"
    placeholder="Search..."
    oninput={() => form.requestSubmit()}
    bind:value
  />
</form>
