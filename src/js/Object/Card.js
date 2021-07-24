export default class Card {
    constructor(key, type, number, value)  {
        this.key = key;
        this.type = type;
        this.number = number;
        this.value = value;
        this.sprite = null;
        this.selected = false;
    }
}