import { as_spades, clubs, diamond, hearts, king_clubs, king_diamond, king_hearts, king_spades, 
    queen_clubs, queen_diamond, queen_hearts, queen_spades, two_hearts, two_spades } from '../setupTests';
import { rankingValue, tripleCard } from '../src/js/Utils/Rules';

describe('Triple Card Test', () => {
    test('Triple Trouble', () => {
        expect(tripleCard([king_spades, king_clubs, king_hearts])).toBeTruthy();
    });

    describe('Different Number, Different Type', () => {
        test('King (D-H-S) vs Queen (H-S-C)', () => {
            expect(rankingValue([king_diamond, king_hearts, king_spades]) > rankingValue([queen_hearts, queen_spades, queen_clubs])).toBeTruthy();
        });
        test('King (D-S-C) vs Queen (H-S-C)', () => {
            expect(rankingValue([king_diamond, king_spades, king_clubs]) > rankingValue([queen_hearts, queen_spades, queen_clubs])).toBeTruthy();
        });
        test('King (H-S-C) vs Queen (D-H-S)', () => {
            expect(rankingValue([king_hearts, king_spades, king_clubs]) > rankingValue([queen_diamond, queen_hearts, queen_spades])).toBeTruthy();
        });
    });

    describe('Different Number, Same Type', () => {
        test('King (D-H-S) vs Queen (D-H-S)', () => {
            expect(rankingValue([king_diamond, king_hearts, king_spades]) > rankingValue([queen_diamond, queen_hearts, queen_spades])).toBeTruthy();
        });
        test('King (D-S-C) vs Queen (D-S-C)', () => {
            expect(rankingValue([king_diamond, king_spades, king_clubs]) > rankingValue([queen_diamond, queen_spades, queen_clubs])).toBeTruthy();
        });
        test('King (H-S-C) vs Queen (H-S-C)', () => {
            expect(rankingValue([king_hearts, king_spades, king_clubs]) > rankingValue([queen_hearts, queen_spades, queen_clubs])).toBeTruthy();
        });
    });

    describe('Triple vs Not Triple', () => {
        test('Three (D-C-H) vs Two(S)-Two(H)-As', () => {
            expect(rankingValue([diamond, clubs, hearts]) > rankingValue([two_spades, two_hearts, as_spades])).toBeTruthy();
        })
    });

    describe('Triple vs Double', () => {
        test('Three (D-C-H) vs Two(S)-Two(H)', () => {
            expect(rankingValue([diamond, clubs, hearts]) > rankingValue([two_spades, two_hearts])).toBeTruthy();
        })
    });
});