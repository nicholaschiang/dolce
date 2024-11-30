<script lang="ts">
  import { formatTiming } from "$lib/formatTiming"

  let {
    count,
    time,
    loading,
    error,
  }: { count?: number; time?: number; loading?: boolean; error?: Error } = $props()
</script>

<div class="text-base tracking-tighter">
  {#if count != null}
    <p>
      Found {count.toLocaleString()} results
      {#if time != null}
        <span class="text-gray-400 dark:text-gray-500">({formatTiming(time)})</span>
      {/if}
    </p>
  {:else if loading}
    <p>Loading...</p>
  {:else if error}
    <p>Error: {error.message}</p>
  {/if}
</div>
