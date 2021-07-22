import { THREE_CARD_DRAW, PAIR_CARD_ONLY, SINGLE_CARD_ONLY } from "../Constant/GamePhase";

export default function validateCard(phase, cards) {
    switch (phase) {
        case THREE_CARD_DRAW:
            return threeCard(cards);
        case PAIR_CARD_ONLY:
            return pairCard(cards);
        case SINGLE_CARD_ONLY:
            return singleCard(cards);
        default:
            return false;
    }
}

function threeCard(cards) {
    return cards.filter(card => card.value == 1).length == cards.length;
}

function pairCard(cards) {
    // if (cards.length == 2) {
    //     return cards[0].value == cards[1].value;
    // }
    // return false;
    return cards.length == 2 && cards[0].value == cards[1].value;
}

function singleCard(cards) {
    return cards.length == 1;
}