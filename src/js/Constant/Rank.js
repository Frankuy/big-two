// TYPES
export const SPADES = 4;
export const HEARTS = 3;
export const CLUBS = 2;
export const DIAMONDS = 1;

// GAMEPLAY
const MIN_VALUE = 1;
const MAX_VALUE = 52;
const MIN_DOUBLE = MIN_VALUE + (MIN_VALUE + 1); // 3D , 3C
const MIN_TRIPLE = MIN_VALUE + (MIN_VALUE + 1) + (MIN_VALUE + 2); // 3D , 3C , 3H
const MIN_STRAIGHT = MIN_VALUE + (MIN_VALUE + 4*1 + 1) + (MIN_VALUE + 4*2 + 2) + (MIN_VALUE + 4*3 + 3) + (MIN_VALUE + 4*4); // 3D, 4C, 5H, 6S, 7D
const MIN_FLUSH = MIN_VALUE + (MIN_VALUE + 4*1) + (MIN_VALUE + 4*2) + (MIN_VALUE + 4*3) + (MIN_VALUE + 4*4); // 3D , 4D , 5D, 6D, 7D
const MIN_FULL_HOUSE = MIN_VALUE + (MIN_VALUE + 1) + (MIN_VALUE + 2) + (MIN_VALUE + 4*1) + (MIN_VALUE + 4*1 + 1); // 3D, 3C, 3H, 4D, 4C
const MIN_FOUR_OF_KIND = MIN_VALUE + (MIN_VALUE + 1) + (MIN_VALUE + 2) + (MIN_VALUE + 3) + (MIN_VALUE + 4*1); // 3D, 3C, 3H, 3S, 4D
const MAX_FIVE_DIFFERENT_TYPE = MAX_VALUE + (MAX_VALUE - 1) + (MAX_VALUE - 2) + (MAX_VALUE - 3) + (MAX_VALUE - 4) // 2S, 2H, 2C, 2D, AS
const MAX_FIVE_DIFFERENT_NUMBER = MAX_VALUE + (MAX_VALUE - 4*1) + (MAX_VALUE - 4*2) + (MAX_VALUE - 4*3) + (MAX_VALUE - 4*4) // 2S, AS, KS, QS, JS

export const DOUBLE = (MAX_VALUE + (MAX_VALUE - 4)) / MIN_DOUBLE; 
export const TRIPLE = (MAX_VALUE + (MAX_VALUE - 4) + (MAX_VALUE - 4*2)) / MIN_TRIPLE;
export const STRAIGHT = MAX_FIVE_DIFFERENT_TYPE / MIN_STRAIGHT;
export const FLUSH = MAX_FIVE_DIFFERENT_NUMBER / MIN_FLUSH;
export const FULL_HOUSE = MAX_FIVE_DIFFERENT_NUMBER / MIN_FULL_HOUSE;
export const FOUR_OF_KIND = MAX_FIVE_DIFFERENT_NUMBER / MIN_FOUR_OF_KIND;
export const STRAIGHT_FLUSH = STRAIGHT * FLUSH;

// export const DOUBLE = 10;
// export const TRIPLE = 100;
// export const STRAIGHT = 1000;
// export const FLUSH = 10000;
// export const FULL_HOUSE = 100000;
// export const FOUR_OF_KIND = 1000000;
// export const STRAIGHT_FLUSH = 10000000;
