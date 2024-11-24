<script lang="ts">
  import { Search } from "lucide-svelte"

  let { data } = $props()
  let form: HTMLFormElement

  const { format } = new Intl.DateTimeFormat(undefined, { dateStyle: "long" })

  type Collection = Awaited<typeof data.collections>[number]
  const sort = (a: Collection, b: Collection) =>
    new Date(b.collectionDate ?? new Date()).valueOf() -
    new Date(a.collectionDate ?? new Date()).valueOf()
</script>

<header
  class="flex h-10 items-center gap-6 border-b border-gray-200 px-6 dark:border-gray-800"
>
  <h1 class="text-lg">collections</h1>
</header>
<div class="flex flex-col gap-6 p-6">
  <form
    data-sveltekit-replacestate
    data-sveltekit-keepfocus
    bind:this={form}
    class="flex h-10 items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 dark:border-gray-800 dark:bg-gray-900"
  >
    <Search class="h-4 w-4" />
    <input
      name="q"
      type="search"
      class="w-0 grow border-0 bg-transparent px-0 focus:ring-0"
      placeholder="Search..."
      oninput={() => form.requestSubmit()}
    />
  </form>
  <div class="flex flex-col gap-2">
    {#await data.collections}
      <p>Loading...</p>
    {:then collections}
      <p>Found {collections.length} results</p>
    {:catch error}
      <p>Error: {error.message}</p>
    {/await}
  </div>
  <ul
    class="grid gap-x-2 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
  >
    {#await data.collections then collections}
      {#each collections.sort(sort) as collection (collection.collectionId)}
        <li class="flex flex-col gap-2 text-xs">
          <div
            class="flex aspect-person w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            {#if collection.lookImageUrl}
              <img
                loading="lazy"
                decoding="async"
                src={collection.lookImageUrl}
                alt="Look {collection.lookNumber} of {collection.collectionName}"
                class="flex h-full w-full items-center justify-center object-cover"
              />
            {:else}
              <span class="text-gray-200 dark:text-gray-700"
                >No look images to show</span
              >
            {/if}
          </div>
          <div>
            <h2>{collection.collectionName}</h2>
            {#if collection.collectionDate}
              <p class="text-gray-400 dark:text-gray-500">
                {format(new Date(collection.collectionDate))}
              </p>
            {/if}
            {#if collection.collectionLocation}
              <p class="text-gray-400 dark:text-gray-500">
                {collection.collectionLocation}
              </p>
            {/if}
          </div>
        </li>
      {/each}
    {/await}
  </ul>
</div>
