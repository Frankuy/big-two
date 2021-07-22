import Phaser from 'phaser';
import c2 from '../../assets/images/2C.png';
import Player from '../Object/Player';
import { DECK_POSITION, PLAYER_POSITION } from '../Reference/Position';
import Deck from '../Object/Deck';
import Image from '../Loader/Image';
import { SINGLE_CARD_ONLY, THREE_CARD_DRAW } from '../Constant/GamePhase';
import validateCard from '../Utils/Rules';

const MAX_PLAYER = 4;
const MAX_PLAYER_CARD = 13;

export default class Game extends Phaser.Scene {
    constructor() {
        super();
        this.state = {
            // shuffle: false,
            play: false,
            turn: 0,
            players: [],
            phase: SINGLE_CARD_ONLY
        }
        this.player = 0;
        this.decks = new Deck();
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

        // Add Event Listener
        // Draw Card event
        this.input.keyboard.on('keyup-SPACE', () => {
            if (this.state.play && this.state.turn == this.player) {
                let selected_cards = this.state.players[this.player].cards.filter(card => card.selected);

                // Validate selected cards
                if (validateCard(this.state.phase, selected_cards)) {
                    let sprites_selected = selected_cards.map(card => card.sprite);
                    this.tweens.add({
                        targets: sprites_selected,
                        x: function (target, key, value, targetIndex, totalTargets, tween) {
                            return DECK_POSITION.x + (targetIndex - Math.floor(totalTargets / 2)) * 40;
                        },
                        y: DECK_POSITION.y,
                        duration: 200,
                    })
                    sprites_selected.forEach(sprite => {
                        sprite.removeInteractive();
                    })
                }
                else { // Selected cards not valid
                    let sprites_selected = selected_cards.map(card => card.sprite);
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
    }

    update(delta) {
        // Shuffle Cards
        // if (!this.state.shuffle) {
        //     this.shuffle();
        // }
        // else { // After shuffle cards
        //     this.giveCard();
        //     this.openCard();
        // }

        // Play Time
        // if (this.state.play) {

        // }
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
                if (player == (this.player % 4)) {
                    x = PLAYER_POSITION[0].x + (idx - Math.floor(MAX_PLAYER_CARD / 2)) * 40;
                    y = PLAYER_POSITION[0].y;
                    angle = 0;
                }
                else if (player == ((this.player + 1) % 4)) {
                    x = PLAYER_POSITION[1].x;
                    y = PLAYER_POSITION[1].y + (idx - Math.floor(MAX_PLAYER_CARD / 2)) * 40;
                    angle = 90;
                }
                else if (player == ((this.player + 2) % 4)) {
                    x = PLAYER_POSITION[2].x - (idx - Math.floor(MAX_PLAYER_CARD / 2)) * 40;
                    y = PLAYER_POSITION[2].y;
                    angle = 0;
                }
                else if (player == ((this.player + 3) % 4)) {
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
                    duration: 200,
                    delay: (idx + player * MAX_PLAYER_CARD) * 200,
                })
            }
        }
        this.decks.cards = [];
    }

    openCard() {
        this.animation.on('complete', (tween, targets) => {
            // Sort active player card
            this.state.players[this.player].cards.sort((a, b) => a.value - b.value)

            // Open active player card
            this.state.players[this.player].cards.forEach((card, index) => {
                card.sprite.setTexture(`${card.key}`);
                card.sprite.setDepth(index);
                this.tweens.add({
                    targets: card.sprite,
                    x: PLAYER_POSITION[0].x + (index - Math.floor(MAX_PLAYER_CARD / 2)) * 40,
                    duration: 200,
                }).on('complete', () => {
                    // Add event to choose card
                    card.sprite.setInteractive()
                        .on('pointerdown', function () {
                            card.selected = !card.selected;
                            if (card.selected) {
                                card.sprite.y = PLAYER_POSITION[0].y - 40;
                            }
                            else {
                                card.sprite.y = PLAYER_POSITION[0].y;
                            }
                        })
                    card.sprite.setInteractive()
                        .on('pointermove', () => {
                            if (!card.selected) {
                                this.tweens.add({
                                    targets: card.sprite,
                                    y: PLAYER_POSITION[0].y - 40,
                                    duration: 200
                                })
                            }
                        })
                    card.sprite.setInteractive()
                        .on('pointerout', () => {
                            if (!card.selected) {
                                this.tweens.add({
                                    targets: card.sprite,
                                    y: PLAYER_POSITION[0].y,
                                    duration: 200
                                })
                            }
                        })
                })
            })
            this.state.play = true;
        });
    }

    drawCard() {

    }
}