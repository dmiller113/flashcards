<script lang="ts">
	import { getCardText } from '$lib/cards';
	import type { CardData } from '$lib/types/cards';

	const { data } = $props();
	const { cardSeries: { cards }} = data;
</script>

<style>
	.cards {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.5rem 0;

		--light-text-color: var(--background-color);
		--dark-text-color: var(--border-color);

		.card {
			align-items: center;
			border: 1px solid var(--border-color);
			border-radius: 0.25rem;
			box-shadow: 0.25rem 0.1rem 0.3rem #666;
			display: flex;
			font-size: 1.5rem;
			font-weight: bold;
			justify-content: center;
			max-width: 100%;
			width: 10rem;

			&[data-backoff="-5"] {
				background-color: #770101;
				color: var(--light-text-color);
			}

			&[data-backoff="-4"] {
				background-color: #8A0202;
				color: var(--light-text-color);
			}

			&[data-backoff="-3"] {
				background-color: #A01111;
				color: var(--light-text-color);
			}

			&[data-backoff="-2"] {
				background-color: #C42424;
				color: var(--light-text-color);
			}

			&[data-backoff="-1"] {
				background-color: #C75757;
				color: var(--light-text-color);
			}

			&[data-backoff="0"] {
				background-color: var(--background-color);
				color: var(--dark-text-color);
			}

			&[data-backoff="1"] {
				background-color: #91f42e;
				color: var(--dark-text-color);
			}

			&[data-backoff="2"] {
				background-color: #80f807;
				color: var(--dark-text-color);
			}

			&[data-backoff="3"] {
				background-color: #54a701;
				color: var(--light-text-color);
			}

			&[data-backoff="4"] {
				background-color: #428003;
				color: var(--light-text-color);
			}

			&[data-backoff="5"] {
				background-color: #346602;
				color: var(--light-text-color);
			}
		}
	}
</style>

{#snippet Card(card: CardData)}
	<li class="card" data-backoff={card.backoff}>
		<p>{getCardText(card)}</p>
	</li>
{/snippet}

<h2>Cards in this Course</h2>
<ul class="cards">
	{#each cards as card}
		{@render Card(card)}
	{/each}
</ul>

