import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
        console.log("MainMenu Scene Loaded");
    }
    init(data) { 
        this.assetPathUrl = data.assetPathUrl;
        console.log(this.assetPathUrl);
        


    }
    preload() {
        this.load.audio('bgSound', 'assets/audios/This Jazz Long Loop.wav')
        this.load.image('bgImage', 'assets/images/3690.jpg')
        this.load.image('cardImage', 'assets/images/png.png')
        this.load.image('menuPanelBg', 'assets/images/21.png');
    }

    create() {
                                                             //* Background sound play loop
        let            bgSound = this.sound.get('bgSound');  // Check if sound already exists
        this.add.image(320, 180, 'menuPanelBg');             // Centered for 640x360
        this.add.image(160, 250, 'cardImage').angle = 140;   // Adjusted position
        this.add.image(620, 0, 'cardImage').angle = -170;    // Adjusted position

        if (!bgSound) {
            bgSound = this.sound.add('bgSound', { loop: true });  // Create and loop it
            bgSound.play();
        } else if (!bgSound.isPlaying) {
            bgSound.play();
        }

          // Title Text
        const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 6, "Memory Game", {
            fontFamily: 'Roboto',
            fontSize  : '36px',       // Reduced from 48px
            fill      : '#fff',
            fontFamily: "lightgreen"

        }).setOrigin(0.5, 0.5);

          // Play Button
        const playButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2.5, "Play", {
            fontFamily: 'Roboto',
            fontSize  : '24px',       // Reduced from 32px
            fontStyle : 'bold',
            fill      : '#2b8',
            fontFamily: "lightgreen"

        })
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                console.log("Play Button clicked!");
                this.scene.start("GamePlayScene",{assetPathUrl:this.assetPathUrl});
            });

          // Hover Effect
        playButton.on("pointerover", () => {
            playButton.setStyle({ fill: "#ff0" });  // Yellow on hover
        }).on("pointerout", () => {
            playButton.setStyle({ fill: "#2b8" });  // Back to green
        });
    }
}
