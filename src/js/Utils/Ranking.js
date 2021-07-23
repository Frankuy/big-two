import { CLUBS, SPADES, DIAMONDS, HEARTS } from '../Constant/Rank';

export function getTypeValue(type) {
    switch (type) {
        case 'C':
            return CLUBS;
        case 'S':
            return SPADES;
        case 'D':
            return DIAMONDS;
        case 'H':
            return HEARTS;
        default:
            return 0;
    }
}
