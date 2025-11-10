import type {
	Answer,
	CardData,
	Operand,
	OperatorParam,
	Question,
} from '$lib/types/cards';

export const getCardText = <T extends { question: Question }>(
	{ question: { prompt } }: T,
) => {
	switch (prompt.type) {
		case 'binary-prompt': {
			const { lhValue, rhValue, operand } = prompt;

			return `${lhValue} ${operand} ${rhValue}`;
		}

		default: {
			throw new Error('missing Question Prompt type');
		}
	}
}

export const checkAnswer = <T extends { answer: Answer }>({
	answer, answer: { type },
}: T) => (value: number) => {
	switch (type) {
		case 'equals': {
			const { value: expectedAnswer } = answer;

			return value === expectedAnswer; 
		}

		default: {
			throw new Error('missing Answer type');
		}
	}
};

export const makeCardData = ({
	lhValue,
	operand,
	rhValue,
	seriesId,
}: {
	lhValue: number;
	operand: Operand;
	rhValue: number;
	seriesId: string;
}): Omit<CardData, 'id'> => ({
	answer: {
		value: solve(operand, lhValue, rhValue),
		type: 'equals',
	},
	backoff: 0,
	question: {
		prompt: {
			lhValue,
			operand,
			rhValue,
			type: 'binary-prompt',
		},
		type: 'free-input',
	},
	seriesId,
});

export const constructInRanges = <T>(fn: (lh: number, rh: number) => T | void) => {
	let acc: ReadonlyArray<T> = [];

	for (let i = 0; i <= 10; i++) {
		for (let j = i; j <= 10; j++) {
			const rv = fn(j, i);

			if (rv !== undefined)
				acc = acc.concat(rv);
		}
	}

	return acc;
};

const makeCardBackoffUpdate = (updateFn: (backoff: number) => number) =>
	<T extends { backoff: number }>(card: T) => ({
		...card,
		backoff: updateFn(card.backoff),
	});

export const backoffCard = makeCardBackoffUpdate((i: number) => i + 1);
export const backonCard = makeCardBackoffUpdate((i: number) => i - 1);

const solve = (operand: Operand, lhValue: number, rhValue: number) => {
	switch(operand) {
		case '+': {
			return lhValue + rhValue;
		}
		case '-': {
			return lhValue - rhValue;
		}
		case '*': {
			return lhValue * rhValue;
		}
		case '/': {
			return lhValue / rhValue;
		}
	}
};

const operatorParamByOperand: Record<Operand, OperatorParam> = {
	'+': 'add',
	'-': 'subtract',
	'*': 'multiply',
	'/': 'divide',
};

const operatorNameByOperand: Record<Operand, string> = {
	'+': 'Addition',
	'-': 'Subtraction',
	'*': 'Multiplication',
	'/': 'Division',
};

export const getOperatorNameFromOperand = (operand: Operand): string =>
	operatorNameByOperand[operand];

export const getOperatorParamFromOperand = (operand: Operand): string =>
	operatorParamByOperand[operand];
