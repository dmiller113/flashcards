import type { LayoutLoad } from './$types';

import { getIndexedDb, getObjectStore } from '$lib/db';
import type { CardData, CardSeries, CardSeriesData } from '$lib/types/cards';

export const load: LayoutLoad = async ({ params, parent }) => {
	// Needed until I move the upgrade code to a more central location
	await parent();

	const db = await getIndexedDb('flashcards', 1);

	const cardSeriesObjectStore = getObjectStore(
		db,
		'cardSeries',
	);

	const cardSeries: CardSeries =
		await cardSeriesObjectStore.getObject(params.operator);

	const cards: ReadonlyArray<CardData> = await new Promise(
		(resolve, reject) => {
			// need to use the raw object store for now
			const cardObjectStore = getObjectStore(db, 'card')._objectStore;
			let request: IDBRequest;

			if (params.operator === 'mixed') {
				request = cardObjectStore
					.index('backoff')
					.getAll(
						IDBKeyRange.bound(-Infinity, Infinity),
						10,
					);
			} else {
				request = cardObjectStore
					.index('seriesBackoff')
					.getAll(IDBKeyRange.bound(
						[params.operator, -Infinity],
						[params.operator, Infinity],
					), 10);
			}

			request.addEventListener('success', () => resolve(request.result));
			request.addEventListener('error', () => reject(request.error));
		},
	);

	const cardSeriesData: CardSeriesData = {
		...cardSeries,
		cards,
	};

	return {
		cardSeries: cardSeriesData,
		params,
	};
};

