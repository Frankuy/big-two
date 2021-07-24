import Phaser from "phaser";
import Background from "../../assets/images/background.png";
import Logo from "../../assets/images/logo_big.png";
import ButtonVsComputer from "../../assets/images/buttons/vs_computer_button.png";
import ButtonOnline from "../../assets/images/buttons/online_button.png";
import ButtonEasy from "../../assets/images/buttons/easy.png";
import ButtonMedium from "../../assets/images/buttons/medium.png";
import ButtonHard from "../../assets/images/buttons/hard.png";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }

    preload() {
        // Load Background
        this.load.image("background-image", Background);

        // Load Logo
        this.load.image("logo-image", Logo);

        // Load Button
        this.load.image("button-vs-computer", ButtonVsComputer);
        this.load.image("button-online", ButtonOnline);
        this.load.image("button-easy", ButtonEasy);
        this.load.image("button-medium", ButtonMedium);
        this.load.image("button-hard", ButtonHard);
    }

    create() {
        // Render Background
        this.add.image(0, 0, "background-image").setOrigin(0, 0)
            .setDisplaySize(window.innerWidth, window.innerHeight);

        // Render Logo
        this.add.image(window.innerWidth / 2, window.innerHeight / 2 - 120, "logo-image");

        // Render Button
        this.button_vs_computer = this.add.image(window.innerWidth / 2, window.innerHeight / 2 + 180, "button-vs-computer")
            .setInteractive()
            .on("pointerdown", () => {
                this.showDifficultyOption();
            });
        this.button_online = this.add.image(window.innerWidth / 2, window.innerHeight / 2 + 300, "button-online");
        this.button_easy = this.add.image(window.innerWidth / 2 - 280, window.innerHeight / 2 + 180, "button-easy").setAlpha(0);
        this.button_medium = this.add.image(window.innerWidth / 2, window.innerHeight / 2 + 180, "button-medium").setAlpha(0);
        this.button_hard = this.add.image(window.innerWidth / 2 + 280, window.innerHeight / 2 + 180, "button-hard").setAlpha(0);
    }

    showDifficultyOption() {
        // Hide Play Option
        this.button_vs_computer.setAlpha(0).disableInteractive();
        this.button_online.setAlpha(0).disableInteractive();

        // Show Difficult Option
        this.button_easy.setAlpha(1);
        this.button_easy.setInteractive()
            .on("pointerdown", () => {
                this.playAgainstComputer("easy");
            });
        this.button_medium.setAlpha(1);
        this.button_medium.setInteractive()
            .on("pointerdown", () => {
                this.playAgainstComputer("medium");
            });
        this.button_hard.setAlpha(1);
        this.button_hard.setInteractive()
            .on("pointerdown", () => {
                this.playAgainstComputer("hard");
            });
    }

    playAgainstComputer(difficulty) {
        if (difficulty == "easy") {
            this.scene.start("Game");
        }
    }
}
