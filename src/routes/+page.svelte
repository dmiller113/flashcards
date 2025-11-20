<script lang="ts">
	import { resolve } from '$app/paths';

	type Operation = {
		href: string;
		name: string;
	};

	const operations: ReadonlyArray<Operation> = [
		{ 
			name: 'Addition',
			href: resolve('/[operator=operation]', { operator: 'add' }),
		},
		{
			name: 'Subtraction',
			href: resolve('/[operator=operation]', { operator: 'subtract' }),
		},
		{
			name: 'Multiplication',
			href: resolve('/[operator=operation]', { operator: 'multiply' }),
		},
		{
			name: 'Division',
			href: resolve('/[operator=operation]', { operator: 'divide' }),
		},
		{
			name: 'Mixed Operations',
			href: resolve('/[operator=operation]', { operator: 'mixed' }),
		},
	];
</script>

<style>
	.operations {
		display: grid;
		gap: 0.5rem 1rem;
		grid-template-columns: 1fr;
		padding: 0.5rem 0;
		width: 100%;

		@media screen and (min-width: 30.1rem) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media screen and (min-width: 50.1rem) {
			grid-template-columns: repeat(4, 1fr);
		}

		@media screen and (min-width: 60.1rem) {
			grid-template-columns: repeat(5, 1fr);
		}
	}
</style>

<h3>Choose operation to review:</h3>
<ul class="operations">
	{#each operations as {href, name}}
		<li class="operation">
			<a class="action button full-width" {href}>{name}</a>
		</li>
	{/each}
</ul>
