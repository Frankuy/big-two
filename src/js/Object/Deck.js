import Card from './Card';
// import Image from '../Loader/Image';

let height = window.innerHeight;
let width = window.innerWidth;

const CARD_TYPES = ['C', 'D', 'H', 'S'];
const CARD_NUMBERS = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];

export default class Deck {
    constructor() {
        // Init Cards
        let cards = [];
        for (const type of CARD_TYPES) {
            let value = 1;
            for (const number of CARD_NUMBERS) {
                let card = new Card(`${number}${type}`, type, number, value)
                cards.push(card);
                // scene.load.image(`${number}${type}`, Image[`./${number}${type}.png`]);
                value += 1;
            }
        }
        this.cards = cards;
        // this.scene = scene;
    }

    // render() {
    //     for (const card of this.cards) {
    //         this.scene.make.sprite({
    //             x: width / 2,
    //             y: height / 2,
    //             key: `${card.key}`,
    //             add: true,
    //             scale: {
    //                 x: 0.2,
    //                 y: 0.2,
    //             },
    //         });
    //     }
    // }
}