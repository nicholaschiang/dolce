<script lang='ts'>
	let { data } = $props();
</script>

<h1 class='font-semibold'>Collections</h1>
<ul>
	{#await data.collections}
		<li>Loading...</li>
	{:then collections}
		{#each collections as collection (collection.id)}
			<li>
				<a href={`/${collection.id}`}>{collection.name}</a>
			</li>
		{/each}
		{#if collections.length === 0}
			<li>No collections found.</li>
		{/if}
	{:catch error}
		<li>Error: {error.message}</li>
	{/await}
</ul>
