import bruteForce from "../Algorithm/BruteForce";
import Player from "./Player";

export default class Bot extends Player {
    constructor(name, index) {
        super(name, index);
    }

    drawCard(scene) {
        bruteForce(this, scene.state.drawed, scene.state.phase);
        let validation = super.drawCard(scene);
        if (validation) {
            return validation;
        }
        else {
            this.setSkip(true);
            return scene.state.phase;
        }
    }
}