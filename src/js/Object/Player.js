import { DECK_POSITION, PLAYER_POSITION } from "../Reference/Position";
import { DURATION, SPACE } from "../Constant/Config";
import { rankingValue, validateCard } from "../Utils/Rules";
import { THREE_CARD_DRAW } from "../Constant/GamePhase";

export default class Player {
    constructor(name, index) {
        this.name = name;
        this.cards = [];
        this.skip = false;
        this.index = index;
    }

    getCards() {
        return this.cards;
    }

    getSelectedCard() {
        return this.cards.filter(card => card.selected);
    }

    getSkip() {
        return this.skip;
    }

    setCards(cards) {
        this.cards = cards;
    }

    setSkip(skip) {
        this.skip = skip;
    }

    selectCard(index) {
        this.cards[index].selected = true;
    }

    openCards(scene) {
        // Sort card
        this.cards.sort((a, b) => a.value - b.value);

        // Open card
        this.cards.forEach((card, index) => {
            card.sprite.setTexture(`${card.key}`);
            card.sprite.setDepth(index);
            let animation = scene.tweens.add({
                targets: card.sprite,
                x: PLAYER_POSITION[this.index].x + (index - Math.floor(this.cards.length / 2)) * SPACE,
                duration: DURATION,
            });

            animation
                .on("complete", () => {
                    // Add event to choose card
                    card.sprite.setInteractive()
                        .on("pointerdown", () => {
                            if (scene.state.turn == this.index) {
                                card.selected = !card.selected;
                            }
                        });
                    card.sprite.setInteractive()
                        .on("pointermove", () => {
                            if (!card.selected) {
                                scene.tweens.add({
                                    targets: card.sprite,
                                    y: PLAYER_POSITION[this.index].y - SPACE,
                                    duration: DURATION
                                });
                            }
                        });
                    card.sprite.setInteractive()
                        .on("pointerout", () => {
                            if (!card.selected) {
                                scene.tweens.add({
                                    targets: card.sprite,
                                    y: PLAYER_POSITION[this.index].y,
                                    duration: DURATION
                                });
                            }
                        });
                });
        });
    }

    drawCard(scene) {
        let selected_cards = this.getSelectedCard();
        let sprites_selected = selected_cards.map(card => card.sprite);
        let validation = validateCard(scene.state.phase, selected_cards);
        let rankValid = scene.state.phase == THREE_CARD_DRAW ? true : rankingValue(selected_cards) > rankingValue(scene.state.drawed);
        if (validation && rankValid) {
            // Open Closed Card
            selected_cards.forEach(card => {
                card.sprite.setTexture(`${card.key}`);
            });

            // Animate drawing card
            this.animation = scene.tweens.add({
                targets: sprites_selected,
                x: function (target, key, value, targetIndex, totalTargets, _tween) {
                    return DECK_POSITION.x + (targetIndex - (totalTargets - 1) / 2) * 160;
                },
                y: DECK_POSITION.y,
                angle: 0,
                duration: DURATION,
            });

            // Clear drawed
            if (scene.state.phase == THREE_CARD_DRAW) {
                if (selected_cards.filter(card => card.type == "S" && card.value == 1).length == 1) {
                    scene.state.first_player = scene.state.turn;
                }
                scene.state.drawed.push(...selected_cards);

                if (scene.state.drawed.length == 4) {
                    this.animation.on("complete", function () {
                        scene.state.drawed.forEach((card) => {
                            card.sprite.destroy();
                        });
                        scene.state.drawed = [];
                    });
                }
            }
            else {
                scene.state.drawed.forEach((card) => {
                    card.sprite.destroy();
                });
                scene.state.drawed = selected_cards;
            }

            // Add selected card to drawed
            sprites_selected.forEach(sprite => {
                sprite.removeInteractive();
            });
            this.setCards(this.cards.filter(card => !card.selected));

            return validation;
        }
        else if (this.index == 0) {
            this.animation = scene.tweens.add({
                targets: sprites_selected,
                y: PLAYER_POSITION[this.index].y,
                duration: DURATION,
            });
        }
        selected_cards.forEach(card => {
            card.selected = false;
        });
        return false;
    }

    arrangeCard(scene) {
        let number_card = this.cards.length;
        for (let idx = 0; idx < number_card; idx++) {
            if (!this.cards[idx].selected) {
                scene.tweens.add({
                    targets: this.cards[idx].sprite,
                    x: PLAYER_POSITION[this.index].x + (idx - Math.floor(number_card / 2)) * SPACE,
                    duration: DURATION,
                });
            }
        }
    }
}