type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14';
type CardCode = string;

const SUIT_MAP: Record<Suit, string> = {
	Hearts: 'H',
	Diamonds: 'D',
	Clubs: 'C',
	Spades: 'S'
} as const;

const VALUE_MAP: Partial<Record<CardValue, string>> = {
	'11': 'J',
	'12': 'Q',
	'13': 'K',
	'14': 'A'
} as const;

export const parseCards = (cardsString: string): CardCode[] => {
	const cardsMatch = cardsString.match(/\[(.*?)\]/);
	if (!cardsMatch) return [];

	const cardsStr = cardsMatch[1];
	return cardsStr.split('} {').map((card) => {
		const [suit, value] = card.replace(/[{}]/g, '').split(' ') as [Suit, CardValue];
		const cardValue = VALUE_MAP[value] || value;
		return `${cardValue}${SUIT_MAP[suit]}`;
	});
};
