import Card from './Card';
import Image from '../Loader/Image';
import { DECK_POSITION, PLAYER_POSITION } from '../Reference/Position';
import Phaser from 'phaser';
import { CARD_TYPES, CARD_NUMBERS, MAX_PLAYER_CARD, SCALE_IMAGE, SPACE, DURATION } from '../Constant/Config';

export default class Deck {
    constructor() {
        // Init Cards
        let cards = [];
        for (const type of CARD_TYPES) {
            let value = 1;
            for (const number of CARD_NUMBERS) {
                let card = new Card(`${number}${type}`, type, number, value)
                cards.push(card);
                value += 1;
            }
        }
        this.cards = cards;
    }

    getCards() {
        return this.cards;
    }

    clearCards() {
        this.cards = [];
    }

    loadImage(scene) {
        scene.load.image('back', Image['./red_back.png']);
        this.cards.forEach(card => {
            scene.load.image(card.key, Image[`./${card.key}.png`]);
        });
    }

    render(scene) {
        this.cards.forEach(card => {
            let card_sprite = scene.make.sprite({
                x: DECK_POSITION.x,
                y: DECK_POSITION.y,
                key: 'back',
                add: true,
                scale: {
                    x: SCALE_IMAGE,
                    y: SCALE_IMAGE,
                },
            });
            card.sprite = card_sprite;
        });
    }

    shuffle() {
        Phaser.Actions.Shuffle(this.cards);
        this.cards.forEach((card, index) => {
            card.sprite.setDepth(index);
        })
    }

    giveCard(scene) {
        for (let player = 0; player < scene.state.players.length; player++) {
            scene.state.players[player].setCards(this.cards.slice(player * MAX_PLAYER_CARD, (player + 1) * MAX_PLAYER_CARD));
        }
        let sprites = this.cards.map(card => card.sprite);
        this.cards = [];
        return scene.tweens.add({
            targets: sprites,
            x: function (target, key, value, targetIndex, totalTargets, tween) {
                if (targetIndex >= 0 * MAX_PLAYER_CARD && targetIndex < 1 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[0].x + (targetIndex % MAX_PLAYER_CARD - Math.floor(MAX_PLAYER_CARD / 2)) * SPACE;
                }
                else if (targetIndex >= 1 * MAX_PLAYER_CARD && targetIndex < 2 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[1].x;
                }
                else if (targetIndex >= 2 * MAX_PLAYER_CARD && targetIndex < 3 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[2].x - (targetIndex % MAX_PLAYER_CARD - Math.floor(MAX_PLAYER_CARD / 2)) * SPACE;
                }
                else if (targetIndex >= 3 * MAX_PLAYER_CARD && targetIndex < 4 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[3].x;
                }
            },
            y: function (target, key, value, targetIndex, totalTargets, tween) {
                if (targetIndex >= 0 * MAX_PLAYER_CARD && targetIndex < 1 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[0].y;
                }
                else if (targetIndex >= 1 * MAX_PLAYER_CARD && targetIndex < 2 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[1].y + (targetIndex % MAX_PLAYER_CARD - Math.floor(MAX_PLAYER_CARD / 2)) * SPACE;
                }
                else if (targetIndex >= 2 * MAX_PLAYER_CARD && targetIndex < 3 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[2].y 
                }
                else if (targetIndex >= 3 * MAX_PLAYER_CARD && targetIndex < 4 * MAX_PLAYER_CARD) {
                    return PLAYER_POSITION[3].y - (targetIndex % MAX_PLAYER_CARD - Math.floor(MAX_PLAYER_CARD / 2)) * SPACE;
                }
            },
            angle: function (target, key, value, targetIndex, totalTargets, tween) {
                if (targetIndex >= 0 * MAX_PLAYER_CARD && targetIndex < 1 * MAX_PLAYER_CARD) {
                    return 0;
                }
                else if (targetIndex >= 1 * MAX_PLAYER_CARD && targetIndex < 2 * MAX_PLAYER_CARD) {
                    return 90;
                }
                else if (targetIndex >= 2 * MAX_PLAYER_CARD && targetIndex < 3 * MAX_PLAYER_CARD) {
                    return 0; 
                }
                else if (targetIndex >= 3 * MAX_PLAYER_CARD && targetIndex < 4 * MAX_PLAYER_CARD) {
                    return 90;
                }
            },
            duration: DURATION,
            delay: function (target, key, value, targetIndex, totalTargets, tween) {
                return targetIndex * DURATION;
            }
        })
    }
}