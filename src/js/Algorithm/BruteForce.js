import { DRAW_ANYTHING, FIVE_CARD_ONLY, PAIR_CARD_ONLY, SINGLE_CARD_ONLY, THREE_CARD_DRAW, TRIPLE_CARD_ONLY } from "../Constant/GamePhase";
import { rankingValue } from "../Utils/Rules";

export default function bruteForce(player, constraint_cards, phase) {
    let result = player.cards;
    if (phase == THREE_CARD_DRAW) {
        result = threeCard(player.cards);
    }
    else if (phase == DRAW_ANYTHING) {
        result = drawAnything(player.cards);
    }
    else if (phase == SINGLE_CARD_ONLY) {
        result = singleCard(player.cards, constraint_cards);
    }
    else if (phase == PAIR_CARD_ONLY) {
        result = pairCard(player.cards, constraint_cards);
    }
    else if (phase == TRIPLE_CARD_ONLY) {
        result = tripleCard(player.cards, constraint_cards);
    }
    else if (phase == FIVE_CARD_ONLY) {
        result = fiveCard(player.cards, constraint_cards);
    }

    player.setCards(result);
}

function threeCard(cards) {
    let result = cards.map(card => {
        if (card.value == 1) {
            card.selected = true;
        }
        else {
            card.selected = false;
        }
        return card
    })
    return result;
}

function drawAnything(cards) {
    let result = [].concat(cards).sort((a, b) => a.value - b.value).map((card, index) => {
        if (index == 0) {
            card.selected = true;
        }
        return card;
    })
    return result;

}

function singleCard(cards, constraint_cards) {
    let found = false;
    let result = cards.map((card) => {
        if (rankingValue([card]) > rankingValue(constraint_cards) && !found) {
            found = true;
            card.selected = true;
        }
        else {
            card.selected = false;
        }
        return card
    })
    return result;
}

function pairCard(cards, constraint_cards) {
    let cards_ = [].concat(cards);
    let found = false;
    for (let idxA = 0; idxA < cards.length; idxA++) {
        for (let idxB = 0; idxB < cards.length; idxB++) {
            let arr = [idxA, idxB];
            let set = new Set(arr);
            if (arr.length === set.size) {
                if (rankingValue([cards[idxA], cards[idxB]]) > rankingValue(constraint_cards)) {
                    found = true;
                }

                if (found) {
                    cards_[idxA].selected = true;
                    cards_[idxB].selected = true;
                    let result = cards_;
                    return result;
                }
            }
        }
    }
    return cards;
}

function tripleCard(cards, constraint_cards) {
    let cards_ = [].concat(cards);
    let found = false;
    for (let idxA = 0; idxA < cards.length; idxA++) {
        for (let idxB = 0; idxB < cards.length; idxB++) {
            for (let idxC = 0; idxC < cards.length; idxC++) {
                let arr = [idxA, idxB, idxC];
                let set = new Set(arr);
                if (arr.length === set.size) {
                    if (rankingValue([cards[idxA], cards[idxB], cards[idxC]]) > rankingValue(constraint_cards)) {
                        found = true;
                    }

                    if (found) {
                        cards_[idxA].selected = true;
                        cards_[idxB].selected = true;
                        cards_[idxC].selected = true;
                        let result = cards_;
                        return result;
                    }
                }
            }
        }
    }
    return cards;
}

function fiveCard(cards, constraint_cards) {
    let cards_ = [].concat(cards);
    let found = false;
    for (let idxA = 0; idxA < cards.length; idxA++) {
        for (let idxB = 0; idxB < cards.length; idxB++) {
            for (let idxC = 0; idxC < cards.length; idxC++) {
                for (let idxD = 0; idxD < cards.length; idxD++) {
                    for (let idxE = 0; idxE < cards.length; idxE++) {
                        let arr = [idxA, idxB, idxC, idxD, idxE];
                        let set = new Set(arr);
                        if (arr.length === set.size) {
                            if (rankingValue([cards[idxA], cards[idxB], cards[idxC], cards[idxD], cards[idxE]]) > rankingValue(constraint_cards)) {
                                found = true;
                            }

                            if (found) {
                                cards_[idxA].selected = true;
                                cards_[idxB].selected = true;
                                cards_[idxC].selected = true;
                                cards_[idxD].selected = true;
                                cards_[idxE].selected = true;
                                let result = cards_;
                                return result;
                            }
                        }
                    }
                }
            }
        }
    }
    return cards;
}