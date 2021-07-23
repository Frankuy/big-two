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
    let score = 0;

    cards.forEach(card => {
        score += (card.value - 1) * 4 + getTypeValue(card.type);
    })

    if (cards.length == 2 && pairCard(cards)) {
        score *= DOUBLE;
    }

    if (cards.length == 3 && threeCard(cards)) {
        score *= TRIPLE;
    }

    if (cards.length == 5) {
        let straightFlag = straightCard(cards);
        let flushFlag = flushCard(cards);
        let fullHouseFlag = fullHouseCard(cards);
        let fourOfKindFlag = fourOfKindCard(cards);

        if (straightFlag && flushFlag) {
            score *= (STRAIGHT_FLUSH + getTypeValue(cards[0].type));
        }
        else if (straightFlag) {
            score *= STRAIGHT;
        }
        else if (flushFlag) {
            score *= (FLUSH + getTypeValue(cards[0].type));
        }
        else if (fullHouseFlag) {
            let triple_values = cards.filter(card => card.value == fullHouseFlag)
                .map(card => card.value)
                .reduce((acc, curr) => acc + curr);
            score *= (FULL_HOUSE + triple_values);
        }
        else if (fourOfKindFlag) {
            let four_values = cards.filter(card => card.value == fourOfKindFlag)
                .map(card => card.value)
                .reduce((acc, curr) => acc + curr);
            score *= (FOUR_OF_KIND + four_values);
        }
    }

    return score;
}

function threeCard(cards) {
    return cards.filter(card => card.value == 1).length == cards.length;
}

function singleCard(cards) {
    return cards.length == 1;
}

function pairCard(cards) {
    return cards.length == 2 && cards[0].value == cards[1].value;
}

function tripleCard(cards) {
    return cards.length == 3 && cards[0].value == cards[1].value
        && cards[0].value == cards[2].value && cards[1].value == cards[2].value;
}

function fiveCard(cards) {
    if (cards.length == 5) {
        return straightCard(cards) || flushCard(cards) || fullHouseCard(cards) || fourOfKindCard(cards);
    }
    return false;
}

function straightCard(cards) {
    let sorted_cards = cards.sort((a, b) => a.value - b.value);
    return (
        sorted_cards[1].value == sorted_cards[0].value + 1 &&
        sorted_cards[2].value == sorted_cards[1].value + 1 &&
        sorted_cards[3].value == sorted_cards[2].value + 1 &&
        sorted_cards[4].value == sorted_cards[3].value + 1
    )
}

function flushCard(cards) {
    return cards.filter(card => card.type == cards[0].type).length == cards.length;
}

function fullHouseCard(cards) {
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

function fourOfKindCard(cards) {
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