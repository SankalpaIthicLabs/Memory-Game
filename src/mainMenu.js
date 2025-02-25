import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
        console.log("MainMenu Scene Loaded");
    }

    preload() {
        this.load.audio('bgSound', 'assets/audios/This Jazz Long Loop.wav')
        this.load.image('bgImage','assets/3690.jpg')

    }

    create() {
        
        //* Background sound play loop
        let bgSound = this.sound.get('bgSound'); // Check if sound already exists
        this.add.image(400,300,'bgImage');

        if (!bgSound) {
            bgSound = this.sound.add('bgSound', { loop: true }); // Create and loop it
            bgSound.play();
        } else if (!bgSound.isPlaying) {
            bgSound.play();
        }

        // Create the title text in the center of the scene
        const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 5, "Memory Game", {
            fontSize: '48px',
            fill: '#fff'
        })
            .setOrigin(0.5, 0.5); // Center the title on the x and y axes

        // Create the Play button below the title
        const playButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 3.5 + 100, "Play", {
            fontSize: '32px',
            fontStyle:'bold',
            fill: '#2b8'
        })
            .setOrigin(0.5, 0.5) // Center the button
            .setInteractive()
            .on("pointerdown", () => {
                console.log("Play Button clicked!");
                this.scene.start("GamePlayScene"); // Transition to GamePlayScene
            });

        //? Add a hover effect to the button
        playButton.on("pointerover", () => {
            playButton.setStyle({ fill: "#ff0" }); // Change to yellow when hovered
        }).on("pointerout", () => {
            playButton.setStyle({ fill: "#2b8" }); // Change back to green when mouse leaves
        });
    }
}
