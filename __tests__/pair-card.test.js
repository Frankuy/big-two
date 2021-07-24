import { as_spades, clubs, diamond, king_clubs, king_diamond, king_hearts, king_spades, 
    queen_clubs, queen_diamond, queen_hearts, queen_spades, two_spades } from '../setupTests';
import { pairCard, rankingValue } from '../src/js/Utils/Rules';

describe('Pair Card Test', () => {
    test('King Spades and King Diamond are met', () => {
        expect(pairCard([king_spades, king_diamond])).toBeTruthy();
    });

    describe('Different Number, Different Type', () => {
        test('King (D-H) vs Queen (S-C)', () => {
            expect(rankingValue([king_diamond, king_hearts]) > rankingValue([queen_spades, queen_clubs])).toBeTruthy();
        });
        test('King (D-S) vs Queen (H-C)', () => {
            expect(rankingValue([king_diamond, king_spades]) > rankingValue([queen_hearts, queen_clubs])).toBeTruthy();
        });
        test('King (D-C) vs Queen (H-S)', () => {
            expect(rankingValue([king_diamond, king_clubs]) > rankingValue([queen_hearts, queen_spades])).toBeTruthy();
        });
        test('King (H-S) vs Queen (D-C)', () => {
            expect(rankingValue([king_hearts, king_spades]) > rankingValue([queen_diamond, queen_clubs])).toBeTruthy();
        });
        test('King (H-C) vs Queen (D-S)', () => {
            expect(rankingValue([king_hearts, king_clubs]) > rankingValue([queen_diamond, queen_spades])).toBeTruthy();
        });
        test('King (S-C) vs Queen (D-H)', () => {
            expect(rankingValue([king_spades, king_clubs]) > rankingValue([queen_diamond, queen_hearts])).toBeTruthy();
        });
    });

    describe('Different Number, Same Type', () => {
        test('King (D-H) vs Queen (D-H)', () => {
            expect(rankingValue([king_diamond, king_clubs]) > rankingValue([queen_diamond, queen_hearts])).toBeTruthy();
        });
        test('King (D-S) vs Queen (D-S)', () => {
            expect(rankingValue([king_diamond, king_spades]) > rankingValue([queen_diamond, queen_spades])).toBeTruthy();
        });
        test('King (D-C) vs Queen (D-C)', () => {
            expect(rankingValue([king_diamond, king_clubs]) > rankingValue([queen_diamond, queen_clubs])).toBeTruthy();
        });
        test('King (H-S) vs Queen (H-S)', () => {
            expect(rankingValue([king_hearts, king_spades]) > rankingValue([queen_hearts, queen_spades])).toBeTruthy();
        });
        test('King (H-C) vs Queen (H-C)', () => {
            expect(rankingValue([king_hearts, king_clubs]) > rankingValue([queen_hearts, queen_clubs])).toBeTruthy();
        });
        test('King (S-C) vs Queen (S-C)', () => {
            expect(rankingValue([king_spades, king_clubs]) > rankingValue([queen_spades, queen_clubs])).toBeTruthy();
        });
    });

    describe('Same Number, Different Type', () => {
        test('King (D-H) vs King (S-C)', () => {
            expect(rankingValue([king_diamond, king_hearts]) < rankingValue([king_spades, king_clubs])).toBeTruthy();
        });
        test('King (D-S) vs King (H-C)', () => {
            expect(rankingValue([king_diamond, king_spades]) > rankingValue([king_hearts, king_clubs])).toBeTruthy();
        });
        test('King (D-C) vs King (H-S)', () => {
            expect(rankingValue([king_diamond, king_clubs]) < rankingValue([king_hearts, king_spades])).toBeTruthy();
        });
    });

    describe('Double vs Not Double', () => {
        test('Three (D-C) vs Two-As', () => {
            expect(rankingValue([diamond, clubs]) > rankingValue([two_spades, as_spades])).toBeTruthy();
        })
    });
    
});