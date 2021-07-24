import Phaser from "phaser";
import Game from "./js/Scene/Game";
import "./css/index.css";
import MainMenu from "./js/Scene/MainMenu";

let width = window.innerWidth;
let height = window.innerHeight;

const config = {
    type: Phaser.CANVAS,
    width,
    height,
    // backgroundColor: "transparent",
    scene: [MainMenu, Game]
};

new Phaser.Game(config);

// window.addEventListener('resize', function () {
//     width = window.innerWidth;
//     height = window.innerHeight;
// })