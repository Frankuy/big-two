import { king_clubs, king_diamond, king_spades, queen_spades } from '../setupTests';
import { rankingValue, singleCard } from '../src/js/Utils/Rules';

describe('Single Card Test', () => {
    test('King Spades is single', () => {
        expect(singleCard([king_spades])).toBeTruthy();
    });

    test('Different Number, Different Type', () => {
        expect(rankingValue([queen_spades]) < rankingValue([king_diamond])).toBeTruthy();
    });
    test('Different Number, Same Type', () => {
        expect(rankingValue([queen_spades]) < rankingValue([king_spades])).toBeTruthy();
    });
    test('Same Number, Different Type', () => {
        expect(rankingValue([king_diamond]) < rankingValue([king_clubs])).toBeTruthy();
    });
});