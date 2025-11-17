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
			? resolve('/cards')
			: resolve('/cards/[operator=operation]/[index=number]', {
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

{#snippet message(correct: boolean)}
	<h4
		style:color={correct ? 'green' : 'red'}
		style:font-size="1.2rem"
		style:font-weight="bold"
		style:margin="0"
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
	<form
		style:align-items="center"
		style:column-gap="1rem"
		style:display="flex"
		onsubmit={handleSubmit}
	>
		<h2
			style:font-size="1.5rem"
			style:line-height="1"
		>
			{getCardText(card)} =
		</h2>
		{#if questionType === 'free-input' && isCorrect === undefined}
			<input
				style:box-sizing="border-box"
				style:font-size="1.25rem"
				style:line-height="1"
				style:padding="0.25rem"
				name={answerName}
				type="number"
				min="0"
				bind:value={cardAnswer}
			/>
		{:else if isCorrect !== undefined}
			<h2
				style:font-size="1.5rem"
				style:line-height="1"
			>
				{cardAnswer}
			</h2>
		{/if}

		{#if isCorrect === undefined }
			<button onclick={handleAnswer}>Check</button>
		{:else}
			<button type="submit">{!isLastCard ? 'Next' : 'Finish'}</button>
		{/if}
	</form>
{/key}

