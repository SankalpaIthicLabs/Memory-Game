import Phaser from 'phaser';

export class PlayerWon extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerWon" });
        console.log("PlayerWon Scene Loaded");
    }

    preload(){
        this.load.image('bgImage','assets/imges/3690.jpg')
    }

    create() {
        this.add.image(400,300,'bgImage');
          // Display a "You Won!" message at the center
        const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 5, "You Won!", {
            fontFamily: 'Roboto',
            fontSize: '48px',
            fill    : '#fff',
            fontFamily: "lightgreen"
        })
            .setOrigin(0.5, 0.5);  // Center the title

          // Display a message below the title
        const message = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 3, "Congratulations!", {
            fontFamily: 'Roboto',
            fontSize: '32px',
            fill    : '#fff',
            fontFamily: "lightgreen"
        })
            .setOrigin(0.5, 0.5);

          // Create a button to go to the Main Menu
        const mainMenuButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "Back to Main Menu", {
            fontFamily: 'Roboto',
            fontSize: '32px',
            fontStyle:'bold',
            fill    : '#0f0',
            fontFamily: "lightgreen"
        })
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                console.log("Back to Main Menu clicked!");

                this.time.delayedCall(1000, () => {

                    this.scene.start("MainMenu");  // Go back to MainMenu

                }, [], this);
            });

          // Optional: Button hover effect
        mainMenuButton.on("pointerover", () => {
            mainMenuButton.setStyle({ fill: "#ff0" });
        }).on("pointerout", () => {
            mainMenuButton.setStyle({ fill: "#0f0" });
        });
    }
}
