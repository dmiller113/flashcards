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

<p>Choose operation to review:</p>
<ul>
	{#each operations as {href, name}}
		<li><a {href}>{name}</a></li>
	{/each}
</ul>
