<script lang="ts">
	import { resolve } from '$app/paths';

	type Operation = {
		href: string;
		name: string;
	};

	const operations: ReadonlyArray<Operation> = [
		{ 
			name: 'Addition',
			href: resolve('/cards/[operator=operation]', { operator: 'add' }),
		},
		{
			name: 'Subtraction',
			href: resolve('/cards/[operator=operation]', { operator: 'subtract' }),
		},
		{
			name: 'Multiplication',
			href: resolve('/cards/[operator=operation]', { operator: 'multiply' }),
		},
		{
			name: 'Division',
			href: resolve('/cards/[operator=operation]', { operator: 'divide' }),
		},
		{
			name: 'Mixed Operations',
			href: resolve('/cards/[operator=operation]', { operator: 'mixed' }),
		},
	];
</script>

<p>Choose operation to review:</p>
<ul>
	{#each operations as {href, name}}
		<li><a {href}>{name}</a></li>
	{/each}
</ul>
