import type { EntryGenerator } from './$types';

export const trailingSlash = 'always';

export const entries: EntryGenerator = () => {
	return [
		{ operator: 'add' },
		{ operator: 'subtract' },
		{ operator: 'multiply' },
		{ operator: 'divide' },
		{ operator: 'mixed' },
	];
};

