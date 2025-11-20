<script lang="ts">
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<style>
	:global {
		a {
			text-decoration: none;
		}

		a, a:visited {
			color: var(--link-color);
		}

		body {
			* > * {
				box-sizing: border-box;
			}

			background-color: var(--background-color);
			display: grid;
			font-size: 1rem;
			margin: 0;
			padding: 1rem;
			row-gap: 0.5rem;
		}

		div.content {
			display: grid;
			row-gap: 1rem;
			width: calc(100vw - 2rem);
		}

		h1, h2, h3, h4, h5, h6 {
			line-height: 1;
			margin: 0;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.75rem;
		}

		h3 {
			font-size: 1.5rem;
		}

		h4 {
			font-size: 1.25rem;
		}

		h5 {
			font-size: 1.1rem;
		}

		h6 {
			font-size: 1rem;
		}

		html {
			font-size: 16px;
			padding: 0;


			--background-color: #ececec;
			--border-color: #555;
			--link-color: #228844;
			--link-hover-color: #087430;
			--light-button-text-color: white;

			--action-button-background: var(--link-color);
			--action-button-hover-background: var(--link-hover-color);
			--action-button-text: var(--background-color);

			--secondary-button-background: var(--background-color);
			--secondary-button-text: var(--link-color);
		}

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		button,
		.button {
			align-items: center;
			border: 1px solid var(--border-color);
			border-radius: 0.5rem;
			display: flex;
			font-size: 1.1rem;
			font-weight: bold;
			justify-content: center;
			padding: 0.75rem 2rem;

			&.action {
				background: var(--action-button-background);
				color: var(--action-button-text);
				transition: background 300ms ease-out;
				width: fit-content;
				
				&:active, &:hover, &:focus,
				&:has(:active), &:has(:hover), &:has(:focus) {
					background: var(--action-button-hover-background);
				}

				&.small {
					font-size: 1rem;
					padding: 0.5rem 1rem;
				}

				&.full-width {
					width: 100%;
				}
			}
		}

	}
</style>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Flash Cards!</title>
</svelte:head>

{@render children?.()}
