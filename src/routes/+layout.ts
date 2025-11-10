import type { LayoutLoad } from './$types';

import {
	getIndexedDb,
	getObjectStore,
	makeObjectStoreBuilder,
} from '$lib/db';
import type { CardData, Operand } from '$lib/types/cards';
import {
	constructInRanges,
	getOperatorNameFromOperand,
	getOperatorParamFromOperand,
	makeCardData,
} from '$lib/cards';

type Id = string;

const makeCardObjectStore = (db: IDBDatabase) => {
		const cardStoreBuilder = makeObjectStoreBuilder(
			db,
			'card',
			{ autoIncrement: true, keyPath: 'id' },
		);

		return cardStoreBuilder
			.makeIndex('backoff', 'backoff')
			.makeIndex('seriesId', 'seriesId')
			.makeIndex('seriesBackoff', ['seriesId', 'backoff'])
			.syncBuild();
};

const makeCardSeriesObjectStore = async (db: IDBDatabase) => {
		const cardStoreBuilder = makeObjectStoreBuilder(
			db,
			'cardSeries',
			{ autoIncrement: true, keyPath: 'id' },
		);

		return cardStoreBuilder
			.makeIndex('symbol', 'symbol')
			.makeIndex('name', 'name')
			.syncBuild();
};

export const load: LayoutLoad = async () => {
	let hasUpgraded = false;

	const onUpgrade = (event: IDBVersionChangeEvent) => {
		const eventDb = (event.currentTarget as IDBOpenDBRequest).result;

		makeCardObjectStore(eventDb);
		makeCardSeriesObjectStore(eventDb);
		hasUpgraded = true;
	};

	const db: IDBDatabase = await getIndexedDb(
		'flashcards',
		1,
		{ onUpgrade },
	);

	db.onerror = (event) => {
		console.error(event.currentTarget);
	};

	try {
		if (hasUpgraded) {
			const constructCard = (
				operand: Operand,
				objectStore: ReturnType<typeof getObjectStore>,
			) => (
				lhValue: number,
				rhValue: number,
			): Promise<Id> | void => {
				const card = makeCardData({
					lhValue,
					operand,
					rhValue,
					seriesId: getOperatorParamFromOperand(operand),
				});

				if (operand === '/' && lhValue % rhValue !== 0) return;

				return objectStore.addObject(card) as Promise<string>;
			}

			for (let operand of ['+', '-', '*', '/'] as const) {
				const cardObjectStore = getObjectStore(
					db,
					'card',
					{ transactionMode: 'readwrite' },
				);

				await Promise.all(
					constructInRanges(constructCard(operand, cardObjectStore)),
				);

				const cardSeriesObjectStore = getObjectStore(
					db,
					'cardSeries',
					{ transactionMode: 'readwrite' },
				);

				await cardSeriesObjectStore.addObject({
					id: getOperatorParamFromOperand(operand),
					name: getOperatorNameFromOperand(operand),
					symbol: operand,
				});

			}

			const cardSeriesObjectStore = getObjectStore(
				db,
				'cardSeries',
				{ transactionMode: 'readwrite' },
			);

			await cardSeriesObjectStore.addObject({
				id: 'mixed',
				name: 'Mixed Operations',
				symbol: null,
			});
		}
	} catch (err) {
		console.error(err);
	}

	try {
		const getCardById = (id: number): Promise<CardData> =>
			getObjectStore(db, 'card').getObject<CardData>(id);

		return {
			getCardById,
		};
	} catch (err) {
		console.error(err);
	}
};

export const ssr = false;
export const prerender = true;
