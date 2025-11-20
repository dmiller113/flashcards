<script lang="ts">
	import { resolve } from '$app/paths';
	import { afterNavigate, goto } from '$app/navigation';
	import { getCardText, checkAnswer } from '$lib/cards';

	const answerName = 'card-answer';

	const { data, params } = $props();
	const { index, operator } = $derived(params);

	const {
		backoffDbCard,
		backonDbCard,
		card,
		nextIndex,
	} = $derived(data);
	const { question: { type: questionType } } = $derived(card);
	const verify = $derived(checkAnswer(card));
	const isLastCard = $derived(nextIndex === null);

	let cardAnswer: number = $state(0);
	let isCorrect: boolean | undefined = $state(undefined);

	const handleAnswer = () => {
		isCorrect = verify(cardAnswer);
		isCorrect ? backoffDbCard() : backonDbCard();
	}

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const url = isLastCard
			? resolve('/')
			: resolve('/[operator=operation]/[index=number]', {
					index: nextIndex!.toString(),
					operator,
				});
			
			goto(url);
	}

	afterNavigate(
		() => {
			cardAnswer = 0;
			isCorrect = undefined;
		}
	);
</script>

<style>
	input.answer {
		font-size: 1.25rem;
		line-height: 1;
		padding: 0.25rem;
	}

	.card {
		align-items: center;
		gap: 1rem;
		display: grid;
		grid-template-areas:
			"problem answer"
			"action action";
		grid-template-columns: auto minmax(0, 1fr);

		.action {
			grid-area: action;
			width: 100%;

			@media screen and (min-width: 50.1rem) {
				width: fit-content;
			}
		}

		.answer {
			grid-area: answer;
		}

		.problem {
			grid-area: problem;
		}

		@media screen and (min-width: 50.1rem) {
			grid-template-areas: "problem answer action";
			grid-template-columns: repeat(2, minmax(0, max-content)) auto;
		}
	}
</style>

{#snippet message(correct: boolean)}
	<h4
		style:color={correct ? 'green' : 'red'}
	>
		{correct ? 'Correct!' : 'Incorrect!'}
	</h4>
{/snippet}

{#snippet correct()}
	{@render message(true)}
{/snippet}

{#snippet incorrect()}
	{@render message(false)}
{/snippet}


{#key index}
	{#if isCorrect}
		{@render correct()}
	{:else if isCorrect === false}
		{@render incorrect()}
	{/if}
	<form class="card"
		onsubmit={handleSubmit}
	>
		<h2 class="problem">
			{getCardText(card)} =
		</h2>
		{#if questionType === 'free-input' && isCorrect === undefined}
			<input
				class="answer"
				name={answerName}
				type="number"
				min="0"
				bind:value={cardAnswer}
			/>
		{:else if isCorrect !== undefined}
			<h2 class="answer">
				{cardAnswer}
			</h2>
		{/if}

		{#if isCorrect === undefined }
			<button class="action" onclick={handleAnswer}>Check</button>
		{:else}
			<button class="action" type="submit">{!isLastCard ? 'Next' : 'Finish'}</button>
		{/if}
	</form>
{/key}

