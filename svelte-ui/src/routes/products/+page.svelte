<script lang="ts">
  import Header from "$lib/components/Header.svelte"
  import Subtitle from "$lib/components/Subtitle.svelte"
  import SearchInput from "$lib/components/SearchInput.svelte"
  import ResultsCount from "$lib/components/ResultsCount.svelte"

  let { data } = $props()
</script>

<Header>
  <a href="/products">Products</a>
</Header>
<div class="flex flex-col gap-6 p-6">
  <SearchInput />
  {#await data.data}
    <ResultsCount loading />
  {:then data}
    <ResultsCount count={data.products.length} time={data.time} />
  {:catch error}
    <ResultsCount {error} />
  {/await}
  <div
    class="grid gap-x-2 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
  >
    {#await data.data then data}
      {#each data.products as product (product.productId)}
        <a
          href={product.priceUrl}
          class="flex flex-col gap-2 text-xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="flex aspect-product w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            {#if product.imageUrl}
              <img
                loading="lazy"
                decoding="async"
                src={product.imageUrl}
                alt={product.productName}
                class="flex h-full w-full items-center justify-center object-cover"
              />
            {:else}
              <span class="text-gray-200 dark:text-gray-700"
                >No product images to show</span
              >
            {/if}
          </div>
          <div>
            <p>{product.brandName}</p>
            <h2>{product.productName}</h2>
            {#if product.priceValue}
              <Subtitle>
                ${Number(product.priceValue).toLocaleString()}
              </Subtitle>
            {/if}
          </div>
        </a>
      {/each}
    {/await}
  </div>
</div>
