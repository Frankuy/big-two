import Phaser from 'phaser';
import Player from '../Object/Player';
import { DECK_POSITION, PLAYER_POSITION } from '../Reference/Position';
import Deck from '../Object/Deck';
import Image from '../Loader/Image';
import { DRAW_ANYTHING, PAIR_CARD_ONLY, SINGLE_CARD_ONLY, THREE_CARD_DRAW } from '../Constant/GamePhase';
import { validateCard, rankingValue } from '../Utils/Rules';

const MAX_PLAYER = 4;
const MAX_PLAYER_CARD = 13;
export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        this.state = {
            // shuffle: false,
            play: false,
            turn: 0,
            players: [],
            phase: THREE_CARD_DRAW,
            drawed: [],
            first_player: -1,
            skip: [false, false, false, false],
        }
        this.player = 0;
        this.decks = new Deck();
        this.phase_indicator = null;
        this.turn_indicator = null;
    }

    preload() {
        //Load Card Image
        this.load.image('back', Image['./red_back.png']);
        this.decks.cards.forEach(card => {
            this.load.image(card.key, Image[`./${card.key}.png`]);
        });
        // Init Players
        for (let idx = 0; idx < MAX_PLAYER; idx++) {
            let player = new Player(PLAYER_POSITION[idx]['x'], PLAYER_POSITION[idx]['y'], `Player ${idx + 1}`);
            this.state.players.push(player);
        }
    }

    create() {
        // Render Cards in Deck Position
        this.decks.cards.forEach(card => {
            let card_sprite = this.make.sprite({
                x: DECK_POSITION.x,
                y: DECK_POSITION.y,
                key: 'back',
                // key: `${card.key}`,
                add: true,
                scale: {
                    x: 0.2,
                    y: 0.2,
                },
            });
            card.sprite = card_sprite;
        });
        this.shuffle();
        this.giveCard();
        this.openCard();

        // Render Phase Indicator
        const style = { font: "bold 32px sans-serif", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.phase_indicator = this.add.text(DECK_POSITION.x, DECK_POSITION.y - 200, '', style).setOrigin(0.5);

        // Render Turn Indicator
        this.turn_indicator = this.add.ellipse(DECK_POSITION.x, DECK_POSITION.y, 40, 40, 0xff0000);

        // Add Event Listener
        // Draw Card event
        this.input.keyboard.on('keyup-SPACE', () => {
            // if (this.state.play && this.state.turn == this.player) { DEBUG
            if (this.state.play) {
                // let selected_cards = this.state.players[this.player].cards.filter(card => card.selected); DEBUG
                let selected_cards = this.state.players[this.state.turn].cards.filter(card => card.selected);
                let sprites_selected = selected_cards.map(card => card.sprite);

                // Validate selected cards
                let validation = validateCard(this.state.phase, selected_cards);
                if (selected_cards.length > 0 && validation) {
                    // Change phase
                    if (this.state.phase == DRAW_ANYTHING) {
                        this.state.phase = validation;
                    }

                    // Add seleected card to drawed
                    if (this.state.phase != THREE_CARD_DRAW) {
                        this.state.drawed.forEach((card) => {
                            card.sprite.destroy();
                        })
                        this.state.drawed = selected_cards;
                    }
                    else {
                        if (selected_cards.filter(card => card.type == 'S' && card.value == 1).length == 1) {
                            this.state.first_player = this.state.turn;
                        }
                        this.state.drawed.push(...selected_cards);
                    }

                    // this.state.players[this.player].cards = this.state.players[this.player].cards.filter(card => !card.selected); DEBUG
                    this.state.players[this.state.turn].cards = this.state.players[this.state.turn].cards.filter(card => !card.selected);

                    // Animate selected card to drawed
                    this.tweens.add({
                        targets: sprites_selected,
                        x: function (target, key, value, targetIndex, totalTargets, tween) {
                            return DECK_POSITION.x + (targetIndex - (totalTargets - 1) / 2) * 160;
                        },
                        y: DECK_POSITION.y,
                        duration: 200,
                    })
                    sprites_selected.forEach(sprite => {
                        sprite.removeInteractive();
                    })

                    // Next player
                    this.state.turn = (this.state.turn + 1) % 4;
                }
                else { // Selected cards not valid
                    this.tweens.add({
                        targets: sprites_selected,
                        y: PLAYER_POSITION[0].y,
                        duration: 200,
                    })
                    selected_cards.forEach(card => {
                        card.selected = false;
                    })
                }
            }
        })

        // SKIP EVENT
        this.input.keyboard.on('keyup-ESC', () => {
            if (this.state.phase != THREE_CARD_DRAW) {
                this.state.skip[this.state.turn] = true;
            }
            this.state.turn = (this.state.turn + 1) % MAX_PLAYER;
        })
    }

    update(delta) {
        if (this.state.play) {
            // Arrange Layout
            this.arrangeCard();
            this.showPhaseIndicator();
            this.showTurnIndicator();

            // Change phase to draw anything
            if (this.state.phase == THREE_CARD_DRAW && this.state.drawed.length == 4) {
                this.state.phase = DRAW_ANYTHING;
                this.state.turn = this.state.first_player;
            }

            // Check who first in next circle
            if (this.state.skip.filter(val => val).length == 3) {
                this.state.skip.forEach((val, index) => {
                    if (!val) {
                        this.state.phase = DRAW_ANYTHING;
                        this.state.turn = index
                    }
                })
                this.state.skip = [false, false, false, false];
            }

            // Skip player cannot run again in the same circle
            if (this.state.skip[this.state.turn]) {
                this.state.turn = (this.state.turn + 1) % 4;
            }

            // Check win condition
            this.state.players.forEach((player) => {
                if (player.cards.length == 0) {
                    console.log(player + ' WIN');
                    this.state.play = false;
                }
            })
        }
    }

    shuffle() {
        Phaser.Actions.Shuffle(this.decks.cards);
        this.decks.cards.forEach((card, index) => {
            card.sprite.setDepth(index);
        })
        this.state.shuffle = true;
    }

    giveCard() {
        for (let player = 0; player < MAX_PLAYER; player++) {
            for (let idx = 0; idx < MAX_PLAYER_CARD; idx++) {
                let x, y, angle;
                if (player == (this.player % MAX_PLAYER)) {
                    x = PLAYER_POSITION[0].x + (idx - Math.floor(MAX_PLAYER_CARD / 2)) * 40;
                    y = PLAYER_POSITION[0].y;
                    angle = 0;
                }
                else if (player == ((this.player + 1) % MAX_PLAYER)) {
                    x = PLAYER_POSITION[1].x;
                    y = PLAYER_POSITION[1].y + (idx - Math.floor(MAX_PLAYER_CARD / 2)) * 40;
                    angle = 90;
                }
                else if (player == ((this.player + 2) % MAX_PLAYER)) {
                    x = PLAYER_POSITION[2].x - (idx - Math.floor(MAX_PLAYER_CARD / 2)) * 40;
                    y = PLAYER_POSITION[2].y;
                    angle = 0;
                }
                else if (player == ((this.player + 3) % MAX_PLAYER)) {
                    x = PLAYER_POSITION[3].x;
                    y = PLAYER_POSITION[3].y - (idx - Math.floor(MAX_PLAYER_CARD / 2)) * 40;
                    angle = 90;
                }
                this.state.players[player].cards.push(this.decks.cards[idx + player * MAX_PLAYER_CARD])
                this.animation = this.tweens.add({
                    targets: this.decks.cards[idx + player * MAX_PLAYER_CARD].sprite,
                    x,
                    y,
                    angle,
                    // duration: 200, DEBUG
                    // delay: (idx + player * MAX_PLAYER_CARD) * 200, DEBUG
                })
            }
        }
        this.decks.cards = [];
    }

    openCard() {
        this.animation.on('complete', (tween, targets) => {
            // DEBUG ONLY
            for (let player = 0; player < MAX_PLAYER; player++) {
                // this.state.players[player].cards.sort((a, b) => a.value - b.value)
                this.state.players[player].cards.forEach((card, index) => {
                    card.sprite.setTexture(`${card.key}`);
                    // card.sprite.setDepth(index);
                    card.sprite.setInteractive()
                        .on('pointerdown', function () {
                            card.selected = !card.selected;
                            // if (card.selected) {
                            //     card.sprite.y = PLAYER_POSITION[0].y - 40;
                            // }
                            // else {
                            //     card.sprite.y = PLAYER_POSITION[0].y;
                            // }
                        })
                })
            }

            // Sort active player card DEBUG
            // this.state.players[this.player].cards.sort((a, b) => a.value - b.value)

            // Open active player card DEBUG
            // this.state.players[this.player].cards.forEach((card, index) => {
            //     card.sprite.setTexture(`${card.key}`);
            //     card.sprite.setDepth(index);
            //     this.tweens.add({
            //         targets: card.sprite,
            //         x: PLAYER_POSITION[0].x + (index - Math.floor(MAX_PLAYER_CARD / 2)) * 40,
            //         duration: 200,
            //     }).on('complete', () => {
            //         // Add event to choose card
            //         card.sprite.setInteractive()
            //             .on('pointerdown', function () {
            //                 card.selected = !card.selected;
            //                 if (card.selected) {
            //                     card.sprite.y = PLAYER_POSITION[0].y - 40;
            //                 }
            //                 else {
            //                     card.sprite.y = PLAYER_POSITION[0].y;
            //                 }
            //             })
            //         card.sprite.setInteractive()
            //             .on('pointermove', () => {
            //                 if (!card.selected) {
            //                     this.tweens.add({
            //                         targets: card.sprite,
            //                         y: PLAYER_POSITION[0].y - 40,
            //                         duration: 200
            //                     })
            //                 }
            //             })
            //         card.sprite.setInteractive()
            //             .on('pointerout', () => {
            //                 if (!card.selected) {
            //                     this.tweens.add({
            //                         targets: card.sprite,
            //                         y: PLAYER_POSITION[0].y,
            //                         duration: 200
            //                     })
            //                 }
            //             })
            //     })
            // })
            this.state.play = true;
        });
    }

    arrangeCard() {
        let number_card = this.state.players[this.player].cards.length;
        for (let idx = 0; idx < number_card; idx++) {
            if (!this.state.players[this.player].cards[idx].selected) {
                this.animation = this.tweens.add({
                    targets: this.state.players[this.player].cards[idx].sprite,
                    x: PLAYER_POSITION[0].x + (idx - Math.floor(number_card / 2)) * 40,
                    duration: 200,
                })
            }
        }
    }

    showPhaseIndicator() {
        this.phase_indicator.setText(this.state.phase);
    }

    showTurnIndicator() {
        let x, y;
        if (this.state.turn == 0) {
            x = PLAYER_POSITION[0].x
            y = PLAYER_POSITION[0].y - 200
        }
        else if (this.state.turn == 1) {
            x = PLAYER_POSITION[1].x + 200
            y = PLAYER_POSITION[1].y
        }
        else if (this.state.turn == 2) {
            x = PLAYER_POSITION[2].x
            y = PLAYER_POSITION[2].y + 200
        }
        else if (this.state.turn == 3) {
            x = PLAYER_POSITION[3].x - 200
            y = PLAYER_POSITION[3].y
        }
        this.turn_indicator.setX(x);
        this.turn_indicator.setY(y);
    }
}