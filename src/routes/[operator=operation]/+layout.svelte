<script lang="ts">
	import { resolve } from '$app/paths';

	const { children, data } = $props();
	const { cardSeries, params: { operator }} = data;
	
	const { name, symbol } = cardSeries;
</script>

<style>
	.heading {
		align-items: center;
		column-gap: 1rem;
		display: flex;
	}
</style>

<div class="heading">
	<h1>
		{name}
		{#if symbol !== null}
			{' '}
			({symbol})
		{/if}
	</h1>

	<a 
		class="button action small"
		href={resolve(
			'/[operator=operation]/[index=number]',
			{ index: "0", operator },
		)}
	>Start Course!</a>
</div>

<div>{@render children?.()}</div>

