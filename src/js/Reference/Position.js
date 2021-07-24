import { CARD_OFFSET } from "../Constant/Config";

let width = window.innerWidth;
let height = window.innerHeight;

const P1_POSITION = {
    x: width / 2,
    y: height - CARD_OFFSET
};

const P2_POSITION = {
    x: 0,
    y: height / 2,
};

const P3_POSITION = {
    x: width / 2,
    y: 0,
};

const P4_POSITION = {
    x: width,
    y: height / 2
};

export const PLAYER_POSITION = [
    P1_POSITION, P2_POSITION, P3_POSITION, P4_POSITION
];

export const DECK_POSITION = {
    x: width / 2,
    y: height / 2
};