<script lang="ts">
	import { resolve } from '$app/paths';

	import { getCardText } from '$lib/cards';
	import type { CardData } from '$lib/types/cards';

	const { data } = $props();
	const { cardSeries: { cards }, params: { operator } } = data;
</script>

{#snippet Card(card: CardData)}
	<li data-backoff={card.backoff}>
		<p>{getCardText(card)}</p>
	</li>
{/snippet}

<a href={resolve(
	'/[operator=operation]/[index=number]',
	{ index: "0", operator },
)}>Start Course!</a>

<h2>Cards in this Course</h2>
<ul>
	{#each cards as card}
		{@render Card(card)}
	{/each}
</ul>

