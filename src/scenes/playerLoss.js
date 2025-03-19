import Phaser from 'phaser';

export class PlayerLost extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerLost" });
        console.log("PlayerLost Scene Loaded");
    }

    preload(){
        this.load.image('bgImage','assets/imges/3690.jpg')
    }

    create() {
        this.add.image(400,300,'bgImage');
          // Display a "You Lost!" message at the center
        const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 5, "You Lost!", {
            fontFamily: 'Roboto',
            fontSize: '48px',
            fill    : '#fff',
            fontFamily: "lightgreen"

        })
            .setOrigin(0.5, 0.5);  // Center the title

          // Display a message below the title
        const message = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2.5, "Better Luck Next Time!", {
            fontFamily: 'Roboto',
            fontSize: '32px',
            fill    : '#fff',
            fontFamily: "lightgreen"

        })
            .setOrigin(0.5, 0.5);

          // Create a button to restart the game
        const restartButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 1.5, "Restart", {
            fontFamily: 'Roboto',
            fontSize: '32px',
            fontStyle:'bold',
            fill    : '#f00',
            fontFamily: "lightgreen"

        })
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                console.log("Restart clicked!");

                this.time.delayedCall(1000, () => {

                    this.scene.start("GamePlayScene");  // Restart the game by going back to MainMenu

                }, [], this);
            });

          // Optional: Button hover effect
        restartButton.on("pointerover", () => {
            restartButton.setStyle({ fill: "#ff0" });
        }).on("pointerout", () => {
            restartButton.setStyle({ fill: "#f00" });
        });
    }
}
