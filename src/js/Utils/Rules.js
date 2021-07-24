import { THREE_CARD_DRAW, PAIR_CARD_ONLY, SINGLE_CARD_ONLY, DRAW_ANYTHING, TRIPLE_CARD_ONLY, FIVE_CARD_ONLY } from "../Constant/GamePhase";
import { DOUBLE, FLUSH, FOUR_OF_KIND, FULL_HOUSE, STRAIGHT, STRAIGHT_FLUSH, TRIPLE } from "../Constant/Rank";
import { getTypeValue } from "./Ranking";

export function validateCard(phase, cards) {
    switch (phase) {
        case THREE_CARD_DRAW:
            return threeCard(cards);
        case PAIR_CARD_ONLY:
            return pairCard(cards);
        case SINGLE_CARD_ONLY:
            return singleCard(cards);
        case TRIPLE_CARD_ONLY:
            return tripleCard(cards);
        case FIVE_CARD_ONLY:
            return fiveCard(cards);
        case DRAW_ANYTHING:
            return drawAnything(cards);
        default:
            return false;
    }
}

export function rankingValue(cards) {
    // let score = 0;

    // Single Card
    if (cards.length == 1) {
        return (cards[0].value - 1) * 4 + getTypeValue(cards[0].type);
    }

    // Double Card
    else if (cards.length == 2 && pairCard(cards)) {
        let val1 = (cards[0].value - 1) * 4 + getTypeValue(cards[0].type);
        let val2 = (cards[1].value - 1) * 4 + getTypeValue(cards[1].type);
        let bonus = cards[0].type == 'S' || cards[1].type == 'S' ? 1 : 0;
        return (val1 + val2 + bonus) * DOUBLE;
    }

    // Triple Card
    else if (cards.length == 3 && tripleCard(cards)) {
        let score = 0;
        cards.forEach(card => {
            score += (card.value - 1) * 4 + getTypeValue(card.type);
        })
        return score * TRIPLE;
    }

    // Five Card
    else if (cards.length == 5) {
        let straightFlag = straightCard(cards);
        let flushFlag = flushCard(cards);
        let fullHouseFlag = fullHouseCard(cards);
        let fourOfKindFlag = fourOfKindCard(cards);


        if (straightFlag && !flushFlag) { // Straight
            let score = 0;
            let sortedCards = [].concat(cards).sort((a, b) => b.value - a.value)
            sortedCards.forEach(card => {
                score += (card.value - 1) * 4;
            });
            score += getTypeValue(sortedCards[0].type)
            score *= STRAIGHT;
            return score;
        }
        else if (flushFlag && !straightFlag) { // Flush
            let score = 0;
            cards.forEach(card => {
                score += (card.value - 1) * 4 + getTypeValue(card.type);
            });
            score *= (FLUSH + getTypeValue(cards[0].type));
            return score;
        }
        else if (fullHouseFlag) { // Full House
            let score = 0;
            cards.forEach(card => {
                score += (card.value - 1) * 4 + getTypeValue(card.type);
            });
            let two_values = cards.filter(card => card.value != fullHouseFlag)
                .map(card => (card.value - 1) * 4 + getTypeValue(card.type))
                .reduce((acc, curr) => acc + curr);

            score -= two_values;
            score *= FULL_HOUSE;
            return score;
        }
        else if (fourOfKindFlag) { // Four of Kind
            let score = 0;
            cards.forEach(card => {
                score += (card.value - 1) * 4 + getTypeValue(card.type);
            });
            let one_values = cards.filter(card => card.value != fourOfKindFlag)
                .map(card => (card.value - 1) * 4 + getTypeValue(card.type))[0];

            score -= one_values;
            score *= FOUR_OF_KIND;
            return score;
        }
        else if (straightFlag && flushFlag) { // Straight Flush
            let score = 0;
            cards.forEach(card => {
                score += (card.value - 1) * 4 + getTypeValue(card.type);
            });
            score *= (STRAIGHT_FLUSH + getTypeValue(cards[0].type));
            return score;
        }
    }

    // Random Card
    let score = 0;
    cards.forEach(card => {
        score += (card.value - 1) * 4 + getTypeValue(card.type);
    });
    return score;
}

export function threeCard(cards) {
    return cards.filter(card => card.value == 1).length == cards.length;
}

export function singleCard(cards) {
    return cards.length == 1;
}

export function pairCard(cards) {
    return cards.length == 2 && cards[0].value == cards[1].value;
}

export function tripleCard(cards) {
    return cards.length == 3 && cards[0].value == cards[1].value
        && cards[0].value == cards[2].value && cards[1].value == cards[2].value;
}

export function fiveCard(cards) {
    if (cards.length == 5) {
        return straightCard(cards) || flushCard(cards) || fullHouseCard(cards) || fourOfKindCard(cards);
    }
    return false;
}

export function straightCard(cards) {
    let sorted_cards = cards.sort((a, b) => a.value - b.value);
    return (
        sorted_cards[1].value == sorted_cards[0].value + 1 &&
        sorted_cards[2].value == sorted_cards[1].value + 1 &&
        sorted_cards[3].value == sorted_cards[2].value + 1 &&
        sorted_cards[4].value == sorted_cards[3].value + 1
    )
}

export function flushCard(cards) {
    return cards.filter(card => card.type == cards[0].type).length == cards.length;
}

export function fullHouseCard(cards) {
    let ref = cards[0].value;
    let ref_2 = -1;
    let result = [0, 0]
    cards.forEach((card) => {
        if (card.value === ref) {
            result[0] += 1;
        }
        else {
            if (ref_2 === -1) {
                ref_2 = card.value;
            }

            if (ref_2 === card.value) {
                result[1] += 1;
            }
        }
    })
    if (result[0] === 3 && result[1] === 2) {
        return ref;
    }
    else if (result[0] === 2 && result[1] === 3) {
        return ref_2;
    }
    return false;
    // return (result[0] === 2 && result[1] === 3) || (result[0] === 3 && result[1] === 2);
}

export function fourOfKindCard(cards) {
    let ref = cards[0].value;
    let ref_2 = -1;
    let result = [0, 0]
    cards.forEach((card) => {
        if (card.value === ref) {
            result[0] += 1;
        }
        else {
            if (ref_2 === -1) {
                ref_2 = card.value;
            }

            if (ref_2 === card.value) {
                result[1] += 1;
            }
        }
    })
    if (result[0] === 4 && result[1] === 1) {
        return ref;
    }
    else if (result[0] === 1 && result[1] === 4) {
        return ref_2;
    }
    return false;
    // return (result[0] === 1 && result[1] === 4) || (result[0] === 4 && result[1] === 1);
}

function drawAnything(cards) {
    if (singleCard(cards)) {
        return SINGLE_CARD_ONLY;
    }
    if (pairCard(cards)) {
        return PAIR_CARD_ONLY;
    }
    if (tripleCard(cards)) {
        return TRIPLE_CARD_ONLY;
    }
    if (fiveCard(cards)) {
        return FIVE_CARD_ONLY;
    }
    return false;
}