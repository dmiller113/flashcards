import type { EntryGenerator, PageLoad } from './$types';
import type { CardData } from '$lib/types/cards';

import { backoffCard, backonCard } from '$lib/cards';
import { getIndexedDb, getObjectStore } from '$lib/db';

import { entries as parentEntries } from '../+page';

export const load: PageLoad = async ({ params, parent }) => {
	const id = parseInt(params.index, 10);

	const parentData = await parent();

	const { cardSeries } = parentData;
	const dbCard: CardData | undefined = cardSeries.cards[id];

	const makeUpdateDbCard = (isIncreased: boolean) => async () => {
		const db = await getIndexedDb('flashcards', 1);
		const objectStore =
			getObjectStore(db, 'card', { transactionMode: 'readwrite' });
		const newCardFn = isIncreased ? backoffCard : backonCard;

		return objectStore.putObject(newCardFn(dbCard));
	};

	return {
		backoffDbCard: makeUpdateDbCard(true),
		backonDbCard: makeUpdateDbCard(false),
		card: dbCard,
		nextIndex: cardSeries.cards[id + 1] !== undefined ? id + 1 : null,
	};
};

export const ssr = false;

export const entries: EntryGenerator = async () => {
	return (await parentEntries()).flatMap(
		({ operator }) =>
			Array.from(
				{ length: 10 },
				(_, i) => ({ operator, index: i.toString() }),
			),
	);
};

