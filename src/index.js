import Phaser from 'phaser';
import Game from './js/Scene/Game';
import './css/index.css';

let width = window.innerWidth;
let height = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#35654d',
    scene: Game
};

const game = new Phaser.Game(config)

// window.addEventListener('resize', function () {
//     width = window.innerWidth;
//     height = window.innerHeight;
// })