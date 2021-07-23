import Phaser from 'phaser';
import Player from '../Object/Player';
import { DECK_POSITION, PLAYER_POSITION } from '../Reference/Position';
import Deck from '../Object/Deck';
import { DRAW_ANYTHING, PAIR_CARD_ONLY, SINGLE_CARD_ONLY, THREE_CARD_DRAW } from '../Constant/GamePhase';
import { validateCard, rankingValue } from '../Utils/Rules';
import Bot from '../Object/Bot';
import { DURATION, MAX_PLAYER, SPACE } from '../Constant/Config';

const MINIMUM_BOT_INDEX = 1;
const MAXIMUM_BOT_INDEX = 3;

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        this.state = {
            play: false,
            turn: 0,
            players: [],
            phase: THREE_CARD_DRAW,
            drawed: [],
            first_player: -1,
            three_counter: 0,
        }
        this.player = 0;
        this.decks = new Deck();
        this.phase_indicator = null;
        this.turn_indicator = null;
        this.animation = null;
    }

    preload() {
        // Load Card Image
        this.decks.loadImage(this);

        // Load Players
        let player = new Player(`Player`, 0);
        this.state.players.push(player);
        for (let idx = MINIMUM_BOT_INDEX; idx <= MAXIMUM_BOT_INDEX; idx++) {
            player = new Bot(`Bot ${idx + 1}`, idx + 1);
            this.state.players.push(player);
        }
    }

    create() {
        // Shuffle Deck
        this.decks.render(this);
        this.decks.shuffle();

        // Give cards to player
        this.animation = this.decks.giveCard(this);

        // When all player already get cards, open player card
        this.animation
            .on('complete', () => {
                this.state.players[this.player].openCards(this);

                // Render Phase Indicator
                const style = { font: "bold 32px sans-serif", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                this.phase_indicator = this.add.text(DECK_POSITION.x, DECK_POSITION.y - 200, '', style).setOrigin(0.5);
                this.showPhaseIndicator();

                // Render Turn Indicator
                // this.turn_indicator = this.add.ellipse(DECK_POSITION.x, DECK_POSITION.y, 40, 40, 0xff0000);
                this.turn_indicator = [
                    this.add.ellipse(PLAYER_POSITION[0].x, PLAYER_POSITION[0].y - 200, 40, 40, 0xff0000),
                    this.add.ellipse(PLAYER_POSITION[1].x + 200, PLAYER_POSITION[1].y, 40, 40, 0xff0000),
                    this.add.ellipse(PLAYER_POSITION[2].x, PLAYER_POSITION[2].y + 200, 40, 40, 0xff0000),
                    this.add.ellipse(PLAYER_POSITION[3].x - 200, PLAYER_POSITION[3].y, 40, 40, 0xff0000),
                ]
                this.showTurnIndicator();

                this.state.play = true;
            });

        // Draw Card event
        this.input.keyboard.on('keyup-SPACE', () => {
            if (this.state.play && this.state.turn == this.player) {
                let validation = this.state.players[this.state.turn].drawCard(this);
                if (validation) { // Player draw card
                    this.state.players[this.state.turn].arrangeCard(this);
                    this.nextTurn(validation);

                    // Arrange Layout
                    this.showPhaseIndicator();
                    this.showTurnIndicator();
                }
            }
        })

        // SKIP EVENT
        this.input.keyboard.on('keyup-ESC', () => {
            if (this.state.turn == this.player) {
                this.state.players[this.state.turn].setSkip(true);
                this.state.turn = (this.state.turn + 1) % MAX_PLAYER;

                // Arrange Layout
                this.showPhaseIndicator();
                this.showTurnIndicator();
            }
        })

        // Bot event
        this.timer = this.time.addEvent({
            loop: true,
            delay: 1000,
            callback: () => {
                // Check player to start round
                if (this.state.phase != THREE_CARD_DRAW) {
                    let skips = this.state.players.map(player => player.skip);
                    if (skips.filter(skip => skip).length == 3) {
                        skips.forEach((val, index) => {
                            if (!val) {
                                this.state.phase = DRAW_ANYTHING;
                                this.state.drawed.forEach(card => card.sprite.destroy());
                                this.state.drawed = [];
                                this.state.turn = index;
                                this.state.players.forEach(player => player.setSkip(false));

                                // Arrange Layout
                                this.showPhaseIndicator();
                                this.showTurnIndicator();
                            }
                        })
                    }
                }


                if (this.state.turn != this.player) { // Bot Time
                    if (!this.state.players[this.state.turn].getSkip()) {
                        let validation = this.state.players[this.state.turn].drawCard(this);
                        this.nextTurn(validation);

                        // Arrange Layout
                        this.showPhaseIndicator();
                        this.showTurnIndicator();
                    }
                    else {
                        this.state.turn = (this.state.turn + 1) % 4;

                        // Arrange Layout
                        this.showPhaseIndicator();
                        this.showTurnIndicator();
                    }
                }
                else { // Player Time
                    if (this.state.players[this.player].getSkip()) { // Check player skip
                        this.state.turn = (this.state.turn + 1) % 4;

                        // Arrange Layout
                        this.showPhaseIndicator();
                        this.showTurnIndicator();
                    }
                }
            }
        })
    }

    update() {
        // Game Start
        if (this.state.play) {
            this.checkWin();
        }
    }

    showPhaseIndicator() {
        this.phase_indicator.setText(this.state.phase);
    }

    showTurnIndicator() {
        this.turn_indicator.forEach((indicator, index) => {
            if (this.state.players[index].getSkip()) {
                indicator.setFillStyle(0x0000ff, 0);
            }
            else {
                if (index == this.state.turn) {
                    indicator.setFillStyle(0x0000ff, 1);
                }
                else {
                    indicator.setFillStyle(0xff0000, 1);
                }
            }
        })
    }

    nextTurn(gameplay) {
        if (this.state.phase == THREE_CARD_DRAW) {
            if (this.state.drawed.length == 4) {
                this.state.phase = DRAW_ANYTHING;
                this.state.players.forEach(player => player.setSkip(false));
                this.state.turn = this.state.first_player;
            }
            else {
                this.state.turn = (this.state.turn + 1) % 4;
            }
        }
        else {
            if (this.state.phase == DRAW_ANYTHING) {
                this.state.phase = gameplay;
            }
            this.state.turn = (this.state.turn + 1) % 4;
        }
    }

    checkWin() {
        this.state.players.forEach((player) => {
            if (player.getCards().length == 0) {
                this.phase_indicator.setText(player.name + ' WIN');
                this.timer.destroy();
            }
        })
    }
}