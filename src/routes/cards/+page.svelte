<script lang="ts">
	type Operation = {
		href: string;
		name: string;
	};

	const operations: ReadonlyArray<Operation> = [
		{ name: "Addition", href: "/cards/add" },
		{ name: "Subtraction", href: "/cards/subtract" },
		{ name: "Multiplication", href: "/cards/multiply" },
		{ name: "Division", href: "/cards/divide" },
		{ name: "Mixed Operations", href: "/cards/mixed" },
	];
</script>

<p>Choose operation to review:</p>
<ul>
	{#each operations as {href, name}}
		<li><a {href}>{name}</a></li>
	{/each}
</ul>
