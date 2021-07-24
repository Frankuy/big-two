import { as_clubs, as_diamond, as_hearts, as_spades, clubs, diamond, eight_diamond, five_diamond, four_clubs, four_diamond, four_hearts, four_spades, hearts, jack_diamond, jack_hearts, jack_spades, king_clubs, king_diamond, king_hearts, king_spades, 
    nine_hearts, 
    nine_spades, 
    queen_clubs, queen_diamond, queen_hearts, queen_spades, seven_diamond, seven_spades, six_diamond, spades, ten_clubs, ten_diamond, ten_hearts, ten_spades, two_clubs, two_diamond, two_hearts, two_spades } from '../setupTests';
import { fiveCard, flushCard, fourOfKindCard, fullHouseCard, rankingValue, straightCard } from '../src/js/Utils/Rules';

describe('Five Card Test', () => {
    let lowest_straight = [clubs, four_diamond, five_diamond, six_diamond, seven_diamond];
    let highest_straight = [two_spades, as_spades, king_spades, queen_spades, jack_hearts];
    let lowest_flush = [diamond, four_diamond, five_diamond, six_diamond, eight_diamond];
    let highest_flush = [two_spades, as_spades, king_spades, queen_spades, ten_spades];
    let lowest_full = [diamond, clubs, hearts, four_diamond, four_clubs];
    let highest_full = [two_spades, two_hearts, two_clubs, as_spades, as_hearts];
    let lowest_four_kind = [diamond, clubs, hearts, spades, four_diamond];
    let highest_four_kind = [two_spades, two_hearts, two_clubs, two_diamond, as_spades];
    let lowest_straight_flush = [diamond, four_diamond, five_diamond, six_diamond, seven_diamond];
    let highest_straight_flush = [two_spades, as_spades, king_spades, queen_spades, jack_spades];
    let highest_not_five = [two_spades, two_hearts, as_spades, as_hearts, king_spades];

    test('Not Five', () => {
        expect(fiveCard(highest_not_five)).toBeFalsy();
    })

    /////////////////// STRAIGHT ///////////////////////
    describe('Straight', () => {
        test('JQKA2 is Straight', () => {
            expect(straightCard(highest_straight)).toBeTruthy();
        });

        test('Different Number, Different Type', () => {
            let straight = [as_spades, king_spades, queen_spades, jack_spades, ten_hearts];
            expect(
                rankingValue(highest_straight) > rankingValue(straight)
            ).toBeTruthy();
        });

        test('Same Number, Different Type', () => {
            let straight = [two_hearts, as_spades, king_spades, queen_spades, jack_spades]; 
            expect(
                rankingValue(highest_straight) > rankingValue(straight)
            ).toBeTruthy();
        })

        test('Straight vs Not Straight', () => {
            expect(
                rankingValue(lowest_straight) > rankingValue(highest_not_five)
            ).toBeTruthy();
        });
    })
    
    /////////////////// FLUSH ///////////////////////
    describe('Flush', () => {
        test('JQKA2 is Flush', () => {
            expect(flushCard(highest_flush)).toBeTruthy();
        });

        test('Different Number, Different Type', () => { 
            let flush = [as_hearts, king_hearts, queen_hearts, jack_hearts, nine_hearts];
            expect(
                rankingValue(highest_flush) > rankingValue(flush)
            ).toBeTruthy();
        });

        test('Same Number, Different Type', () => { 
            let flush = [two_hearts, as_hearts, king_hearts, queen_hearts, ten_hearts];
            expect(
                rankingValue(highest_flush) > rankingValue(flush)
            ).toBeTruthy();
        });

        test('Different Number, Same Type', () => {
            let flush = [as_spades, king_spades, queen_spades, ten_spades, nine_spades];
            expect(
                rankingValue(highest_flush) > rankingValue(flush)
            ).toBeTruthy();
        });

        test('Flush vs Not Flush', () => {
            expect(
                rankingValue(lowest_flush) > rankingValue(highest_not_five)
            ).toBeTruthy();
        });
        
        test('Flush vs Straight', () => {
            expect(
                rankingValue(lowest_flush) > rankingValue(highest_straight)
            ).toBeTruthy();
        });
    });

    /////////////////// FULL HOUSE ///////////////////////
    describe('Full House', () => {
        test('House of cards', () => {
            expect(fullHouseCard(highest_full)).toBeTruthy();
        });

        test('Different Number, Different Type', () => {
            let full = [as_hearts, as_clubs, as_diamond, two_spades, two_hearts];
            expect(rankingValue(highest_full) > rankingValue(full)).toBeTruthy();
        });

        test('Same Number, Different Type', () => {
            let full = [two_hearts, two_clubs, two_diamond, as_spades, as_hearts];
            expect(rankingValue(highest_full) > rankingValue(full)).toBeTruthy();
        });
        
        test('Different Number, Same Type', () => {
            let full = [as_hearts, as_clubs, as_diamond, two_spades, two_hearts];
            expect(rankingValue(highest_full) > rankingValue(full)).toBeTruthy();
        });

        test('Full House vs Not Full House', () => {
            expect(rankingValue(lowest_full) > rankingValue(highest_not_five)).toBeTruthy();
        })

        test('Full House vs Flush', () => {
            expect(rankingValue(lowest_full) > rankingValue(highest_flush)).toBeTruthy();
        })

        test('Full House vs Straight', () => {
            expect(rankingValue(lowest_full) > rankingValue(highest_straight)).toBeTruthy();
        })
    });

    /////////////////// FOUR OF A KIND ///////////////////////
    describe('Four of A Kind', () => {
        test('Four Kindness', () => {
            expect(fourOfKindCard(highest_four_kind)).toBeTruthy();
        });

        test('Different Number, Same Type', () => {
            let four_kind = [as_spades, as_hearts, as_clubs, as_diamond, two_spades];
            expect(rankingValue(highest_four_kind) > rankingValue(four_kind)).toBeTruthy();
        });

        test('Four Kind vs Not Four Kind', () => {
            expect(rankingValue(lowest_four_kind) > rankingValue(highest_not_five)).toBeTruthy();
        })

        test('Four Kind vs Full House', () => {
            expect(rankingValue(lowest_four_kind) > rankingValue(highest_full)).toBeTruthy();
        })

        test('Four Kind vs Flush', () => {
            expect(rankingValue(lowest_four_kind) > rankingValue(highest_flush)).toBeTruthy();
        })

        test('Four Kind vs Straight', () => {
            expect(rankingValue(lowest_four_kind) > rankingValue(highest_straight)).toBeTruthy();
        })
    })
    
    /////////////////// STRAIGHT FLUSH ///////////////////////
    describe('Straight Flush', () => {
        test('Straight & Flush', () => {
            expect(straightCard(highest_straight_flush) && flushCard(highest_straight_flush)).toBeTruthy();
        })

        test('Different Number, Different Type', () => {
            let straight_flush =  [as_hearts, king_hearts, queen_hearts, jack_hearts, ten_hearts];
            expect(rankingValue(highest_straight_flush) > rankingValue(straight_flush)).toBeTruthy();
        })

        test('Different Number, Same Type', () => {
            let straight_flush =  [as_spades, king_spades, queen_spades, jack_spades, ten_spades];
            expect(rankingValue(highest_straight_flush) > rankingValue(straight_flush)).toBeTruthy();
        })

        test('Same Number, Different Type', () => {
            let straight_flush =  [two_hearts, as_hearts, king_hearts, queen_hearts, jack_hearts];
            expect(rankingValue(highest_straight_flush) > rankingValue(straight_flush)).toBeTruthy();
        })

        test('Straight Flush vs Not Straight Flush', () => {
            expect(rankingValue(lowest_straight_flush) > rankingValue(highest_not_five)).toBeTruthy();
        })

        test('Straight Flush vs Four of a Kind', () => {
            expect(rankingValue(lowest_straight_flush) > rankingValue(highest_four_kind)).toBeTruthy();
        })

        test('Straight Flush vs Full House', () => {
            expect(rankingValue(lowest_straight_flush) > rankingValue(highest_full)).toBeTruthy();
        })

        test('Straight Flush vs Flush', () => {
            expect(rankingValue(lowest_straight_flush) > rankingValue(highest_flush)).toBeTruthy();
        })

        test('Straight Flush vs Straight', () => {
            expect(rankingValue(lowest_straight_flush) > rankingValue(highest_straight)).toBeTruthy();
        })
    })
})
