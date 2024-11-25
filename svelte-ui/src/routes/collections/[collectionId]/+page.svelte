<script lang="ts">
  import { ExternalLink, ChevronRight } from "lucide-svelte"
  import { formatDate } from "$lib/formatDate"
  import { formatSeasonName } from "$lib/formatSeasonName"
  import { formatLevelName } from "$lib/formatLevelName"
  import { formatLocation } from "$lib/formatLocation"

  import Header from "$lib/components/Header.svelte"
  import Subtitle from "$lib/components/Subtitle.svelte"

  let { data } = $props()
</script>

<Header>
  <a href="/">Collections</a>
  <ChevronRight class="h-4 w-4 text-gray-200 dark:text-gray-800" />
  {#await data.collection then collection}
    <a href="/?q={encodeURIComponent(collection.brand.name)}"
      >{collection.brand.name}</a
    >
    <ChevronRight class="h-4 w-4 text-gray-200 dark:text-gray-800" />
    <a href="/?q={encodeURIComponent(formatSeasonName(collection.season))}"
      >{formatSeasonName(collection.season)}
      {formatLevelName(collection.level)}</a
    >
    <div class="flex items-center gap-1">
      {#if collection.date}
        <span class="text-sm text-gray-400 dark:text-gray-500"
          >({formatDate(new Date(collection.date))})</span
        >
      {/if}
      {#if collection.location}
        <span class="text-sm text-gray-400 dark:text-gray-500"
          >({formatLocation(collection.location)})</span
        >
      {/if}
    </div>
  {/await}
</Header>
<div class="flex h-full flex-col xl:flex-row">
  <div class="flex flex-col gap-6 p-6 xl:w-0 xl:grow">
    {#await data.collection}
      <p>Loading...</p>
    {:then collection}
      <div
        class="grid gap-x-2 gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3"
      >
        {#each collection.looks as look (look.id)}
          <a
            href={look.images[0].url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col gap-2 text-xs"
          >
            <div
              class="flex aspect-person w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
            >
              {#if look.images[0]?.url}
                <img
                  loading="lazy"
                  decoding="async"
                  src={look.images[0].url}
                  alt="Look {look.number} of {collection.name}"
                  class="flex h-full w-full items-center justify-center object-cover"
                />
              {:else}
                <span class="text-gray-200 dark:text-gray-700"
                  >No look images to show</span
                >
              {/if}
            </div>
            <p>Look {look.number}</p>
          </a>
        {/each}
      </div>
    {/await}
  </div>
  {#await data.collection then collection}
    {#if collection.articles.length}
      <div class="flex flex-col gap-12 p-6 xl:pr-12">
        {#each collection.articles as article (article.id)}
          <div class="flex flex-col gap-4 text-sm">
            <div>
              <h2 class="flex items-center gap-2">
                <span
                  >By <a
                    href={article.user_authorId?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline">{article.user_authorId?.name}</a
                  >
                  for
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline">{article.publication.name}</a
                  ></span
                >
                <ExternalLink class="h-4 w-4" />
              </h2>
              {#if article.writtenAt}
                <Subtitle>{formatDate(new Date(article.writtenAt))}</Subtitle>
              {/if}
            </div>
            <article class="prose prose-sm prose-zinc dark:prose-invert">
              {@html article.content}
            </article>
          </div>
        {/each}
      </div>
    {/if}
  {/await}
</div>
