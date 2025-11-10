export type Answer = 
	| { value: number, type: 'equals' }

export type CardData = {
	answer: Answer;
	backoff: number;
	id: number;
	question: Question;
	seriesId: string;
}

export type CardSeries = {
	id: OperatorParam;
	name: string;
	symbol: string | null;
}

export type CardSeriesData = {
	cards: ReadonlyArray<CardData>;
	name: string;
	symbol: string | null;
}

export type Operand =
	| '+'
	| '-'
	| '*'
	| '/'

export type Question = 
	| { prompt: Prompt; type: 'free-input' }

export type Prompt =
	| { lhValue: number; rhValue: number; operand: Operand; type: 'binary-prompt'}

const OPERATOR_PARAM = [
	'add',
	'subtract',
	'multiply',
	'divide',
	'mixed',
]

export type OperatorParam = typeof OPERATOR_PARAM[number]

export const isOperatorParam = (value: string): value is OperatorParam =>
	OPERATOR_PARAM.includes(value)

