<script lang="ts">
  import { Highlight } from "svelte-highlight";
  import sql from "svelte-highlight/languages/sql";
  import "svelte-highlight/styles/github-dark.css";
  import { format } from "@supabase/sql-formatter"
  let { data } = $props()
  let value = $state("")
  let code = $derived(format(data.sql))
</script>

<header
  class="flex h-10 items-center gap-6 border-b border-gray-200 px-6 dark:border-gray-800"
>
  <h1 class="text-lg">collections</h1>
</header>
<div class="flex flex-col gap-6 p-6">
  <form method="get">
    <input
      name="q"
      type="search"
      class="block w-full border-gray-200 bg-transparent focus:ring-0 dark:border-gray-700"
      placeholder="Search collections"
      bind:value
    />
  </form>
  <div class="flex flex-col gap-2">
    {#await data.collections}
			<p>Executing query...</p>
			<Highlight class="text-xs" language={sql} {code} />
    {:then collections}
      <p>{collections.length} collections found</p>
    {:catch error}
      <p>Error: {error.message}</p>
    {/await}
  </div>
  <ul
    class="grid gap-x-2 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
  >
    {#await data.collections then collections}
      {#each collections as collection (collection.id)}
        <li class="flex flex-col gap-2 text-xs">
          <div
            class="flex aspect-person w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            {#if collection.looks[0]?.images[0]?.url}
              <img
                src={collection.looks[0].images[0].url}
                alt={collection.name}
                class="h-full w-full object-cover flex items-center justify-center"
                loading="lazy"
                decoding="async"
              />
            {:else}
              <span class="text-gray-200 dark:text-gray-700"
                >No look images to show</span
              >
            {/if}
          </div>
          <div>
            <h2 class="font-semibold uppercase">{collection.brand.name}</h2>
            <h3>{collection.season.name}</h3>
            {#if collection.location}
              <p class="text-gray-400 dark:text-gray-500">
                {collection.location}
              </p>
            {/if}
          </div>
        </li>
      {/each}
      {#if collections.length === 0}
        <li>No collections found.</li>
      {/if}
    {/await}
  </ul>
</div>
