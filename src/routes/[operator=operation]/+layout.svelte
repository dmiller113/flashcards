<script lang="ts">
	const { children, data } = $props();
	const { cardSeries } = data;
	
	const { name, symbol } = cardSeries;
</script>

<h1>
	{name}
	{#if symbol !== null}
		{' '}
		({symbol})
	{/if}
</h1>

<div>{@render children?.()}</div>

