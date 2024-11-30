<script lang="ts">
  import { formatDate } from "$lib/formatDate"
  import { formatLocation } from "$lib/formatLocation"
  import { DEFAULT_COLLECTIONS_SEARCH } from "$lib/constants"

  import Header from "$lib/components/Header.svelte"
  import Subtitle from "$lib/components/Subtitle.svelte"
  import SearchInput from "$lib/components/SearchInput.svelte"
  import ResultsCount from "$lib/components/ResultsCount.svelte"

  let { data } = $props()

  type Collection = Awaited<typeof data.data>["collections"][number]
  const sort = (a: Collection, b: Collection) =>
    new Date(b.collectionDate ?? new Date()).valueOf() -
    new Date(a.collectionDate ?? new Date()).valueOf()
</script>

<Header>
  <a href="/">Collections</a>
</Header>
<div class="flex flex-col gap-6 p-6">
  <SearchInput defaultSearch={DEFAULT_COLLECTIONS_SEARCH} />
  {#await data.data}
    <ResultsCount loading />
  {:then data}
    <ResultsCount count={data.collections.length} time={data.time} />
  {:catch error}
    <ResultsCount {error} />
  {/await}
  <div
    class="grid gap-x-2 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
  >
    {#await data.data then data}
      {#each data.collections.sort(sort) as collection (collection.collectionId)}
        <a
          href="/collections/{collection.collectionId}"
          class="flex flex-col gap-2 text-xs"
        >
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
              <Subtitle>
                {formatDate(new Date(collection.collectionDate))}
              </Subtitle>
            {/if}
            {#if collection.collectionLocation}
              <Subtitle>
                {formatLocation(collection.collectionLocation)}
              </Subtitle>
            {/if}
          </div>
        </a>
      {/each}
    {/await}
  </div>
</div>
