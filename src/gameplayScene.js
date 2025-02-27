import { config } from './config';
import './style.css';
import Phaser, { Game } from 'phaser';

export class GamePlayScene extends Phaser.Scene {
  constructor() {
    super('GamePlayScene');
    this.emitter
  }

  init() {

    this.isPanelClosed = true;
  }

  preload() {
    this.imageLoader();
    this.audioLoader();
  }

  create() {

    this.add.image(400, 300, 'bgImage');
    this.InforPanel();



  }



  update() { }

    // !=============================Sub Methods===============================!\\





  InforPanel() {

    let infoIcon = this.add.image(100, 25, 'infoIcon')  // Adjust position as needed
      .setOrigin(1, 0)
      .setScale(0.08)
      .setInteractive();

                                                       // Create the semi-transparent popup background
    let popupBg = this.add.image(400, 300, 'panelBg')  // Dark rectangle
      .setScale(0.5)
      .setOrigin(0.5)
      .setVisible(true);  // Initially hidden


    let titleText = this.add.text(400, 200, "How to Play", {
      fontFamily: 'Roboto',
      fontSize  : '28px',
      fontStyle : 'bold',
      color     : '#ffffff',
      align     : 'center'
    }).setOrigin(0.5).setVisible(true);


      // Add text inside the popup
    let popupText = this.add.text(400, 325, "- Click cards to reveal images\n\n- Match all the pairs to win\n\n- If you find incorrect pairs the game ends\n\n", {
      fontFamily: 'Roboto',
      fontSize  : '20px',
      color     : '#ffffff',
      align     : 'left',
      wordWrap  : { width: 450 }
    }).setOrigin(0.5).setVisible(true);


    let finleText = this.add.text(400, 400, "Good luck!", {
      fontFamily: 'Roboto',
      fontSize  : '28px',
      fontStyle : 'bold',
      color     : '#ffffff',
      align     : 'center'
    }).setOrigin(0.5).setVisible(true);

      // Close button
    let closeButton = this.add.image(625, 165, "closeIcon")
      .setOrigin(1, 0)
      .setScale(0.06)
      .setVisible(true)
      .setInteractive();

      // Show popup when info icon is clicked
    infoIcon.on('pointerdown', () => {
      popupBg.setVisible(true).setDepth(100);
      popupText.setVisible(true).setDepth(101);
      titleText.setVisible(true).setDepth(102);
      finleText.setVisible(true).setDepth(103);
      closeButton.setVisible(true).setDepth(104);
    });

      // Hide popup when close button is clicked
    closeButton.on('pointerdown', () => {
      popupBg.setVisible(false);
      popupText.setVisible(false);
      titleText.setVisible(false);
      finleText.setVisible(false);
      closeButton.setVisible(false);

      console.log(`Close icon clicked the status is : ${this.isPanelClosed}`);
      if (this.isPanelClosed) {

        this.cardGenerator();
      }
      this.isPanelClosed = false;

    });
  }

  cardGenerator() {
    let cols     = 3;
    let rows     = 2;
    let startX   = 200;
    let startY   = 175;
    let spacingX = 200;
    let spacingY = 275;

    let matchedPairs = 0;
    let maxPairs     = 3;

    let firstClick  = null;
    let secondClick = null;

    let cards = [];

    let characterImages = ['character1', 'character2', 'character3', 'character4', 'character5', 'character6'];

      //? Randomly select 3 images from the available list
    let selectedImages = Phaser.Utils.Array.Shuffle(characterImages).slice(0, 3);

      //? Text field to shgow the player proggress
    let progressText = this.add.text(750, 25, `0 / ${maxPairs}`, { fontSize: '24px', fill: '#fff', fontFamily: 'Roboto', fontStyle: 'bold' }).setOrigin(1, 0);

                                                             //? Create pairs
    let imagePairs = selectedImages.concat(selectedImages);  // 3 selected images, each duplicated

      //? Shuffle the pairs to randomize their positions in the grid
    Phaser.Utils.Array.Shuffle(imagePairs);

    let positions = [];
      //? Generate random positions for the cards
    while (positions.length < 6) {
      let randomPos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
      if (!positions.some(p => p.x === randomPos.x && p.y === randomPos.y)) {
        positions.push(randomPos);
      }
    }

    let index = 0;

      //? Loop to generate cards in the grid
    positions.forEach(({ x, y }) => {
      let cardBackImage = this.addImageToScene(startX + x * spacingX, startY + y * spacingY, 'backImage')
        .setDisplaySize(150, 250)
        .setOrigin(0.5, 0.5)
        .setInteractive();

      let characterImage = this.addImageToScene(cardBackImage.x, cardBackImage.y, imagePairs[index])
        .setDisplaySize(150, 250)
        .setOrigin(0.5, 0.5);

      index++;

      cards.push({ cardBackImage, characterImage });

        // Initially hide the character image
        // characterImage.setVisible(false);
      cardBackImage.setVisible(false);

    });

      // **STEP 1: SHOW CARDS FOR MEMORIZATION**
    this.time.delayedCall(500, () => {
      cards.forEach(({ characterImage }) => {
        this.tweens.add({
          targets : characterImage,
          alpha   : 1,
          duration: 500
        });
      });

        // **STEP 2: FLIP THEM BACK AFTER 2 SECONDS**
      this.time.delayedCall(1000, () => {
        cards.forEach(({ cardBackImage, characterImage }) => {
          this.tweens.add({
            targets   : characterImage,
            alpha     : 0,
            duration  : 500,
            onComplete: () => {
              cardBackImage.setVisible(true);
            }
          });
        });

          // **STEP 3: ENABLE PLAYER INTERACTION AFTER FLIP**
        this.time.delayedCall(500, () => {
          cards.forEach(({ cardBackImage, characterImage }) => {

            cardBackImage.on('pointerdown', (pointer) => {
              this.imageClickSound = this.sound.add('imageClickSound');
              this.imageClickSound.play();


                /*               // **Create Particle Manager only once**
            if (!this.particleManager) {
              this.particleManager = this.add.particles('waterDropImage');
          }
         */
              let emitter = this.add.particles(0, 0, "waterDropImage", {
                x       : this.cameras.main.centerX,        // Position at the center horizontally
                y       : this.cameras.main.height / 1.5,   // Position at the bottom of the screen
                speed   : 350,                              // Speed of the particles
                gravityY: 500,                              // Gravity to pull particles down
                scale   : 0.2,                              // Scale of the particles
                duration: 100,                              // How long the particles last
                emitting: false,                            // Initially don't emit
                angle   : { min: 0, max: 360 },             // Random angle from 0 to 360 degrees
                rotate  : { min: -360, max: 360 },          // Apply a random rotation on each particle's lifetime
              });


                // emitter.start(pointer.x, pointer.y, 1000)

              this.time.delayedCall(500, () => {
                emitter.stop();  // Stop emission instead of destroying particles
              });
                //TODO Check if the player clicked the same images in row
                // console.log('Revealed Image:', characterImage.texture.key);



              if (!firstClick) {

                firstClick = characterImage.texture.key;
                console.log("First Click:", firstClick);

              } else if (!secondClick) {

                secondClick = characterImage.texture.key;
                console.log("Second Click:", secondClick);

                if (firstClick == secondClick) {
                  matchedPairs++;

                  progressText.setText(`${matchedPairs} / ${maxPairs}`);
                  console.log("Same image clicked twice!");
                    //TODO correct sound play
                  this.correctAnswerkSound = this.sound.add('correctAnswerkSound');
                  this.correctAnswerkSound.play();

                    // Store references to matched images
                  let matchedCards = cards.filter(c => c.characterImage.texture.key === firstClick);

                    // Animate matched cards

                  this.time.delayedCall(750, () => {

                    matchedCards.forEach(({ cardBackImage, characterImage }) => {
                      this.tweens.add({
                        targets: [cardBackImage, characterImage],
                        scaleX : 0.3,
                        scaleY : 0.4,
                          // alpha: 0,
                        duration  : 75,
                        ease      : 'Linear',
                        onComplete: () => {

                          this.tweens.add({
                            targets   : [cardBackImage, characterImage],
                            scaleX    : 0,
                            scaleY    : 0,
                            alpha     : 0,
                            duration  : 150,
                            ease      : 'Linear',
                            onComplete: () => {
                              cardBackImage.setVisible(false);
                              characterImage.setVisible(false);
                            }
                          }
                          )
                        }
                      });
                    });
                  });
                  firstClick  = null;
                  secondClick = null;

                  if (matchedPairs == maxPairs) {
                    console.log("Player won");
                    this.time.delayedCall(2000, () => {
                      this.scene.start("PlayerWon");
                    });
                  }
                } else {
                  console.log("Different images clicked. player loss");
                    //TODO wrong sound play

                  this.wrrongAnswerSound = this.sound.add('wrrongAnswerSound');
                  this.wrrongAnswerSound.play();


                  this.tweens.add({
                    targets   : [cardBackImage, characterImage],
                    x         : `+=10`,
                    duration  : 100,
                    yoyo      : true,
                    repeat    : 3,
                    ease      : 'Linear',
                    onComplete: () => {
                      cardBackImage.x  -= 10;
                      characterImage.x -= 10;
                    }
                  });

                    // Delay before losing screen
                  this.time.delayedCall(2000, () => {
                    this.scene.start("PlayerLost");
                  });
                }


                  // Reset for next check
                firstClick  = null;
                secondClick = null;


              }


                //? Card Revealed Tween Animation
              this.cardRevealedTweenAnimation(cardBackImage, characterImage);
            });
          });
        });
      });
    });
  }


  imageLoader() {
    this.load.image('character1', 'assets/images/1.png');
    this.load.image('character2', 'assets/images/2.png');
    this.load.image('character3', 'assets/images/3.png');
    this.load.image('character4', 'assets/images/4.png');
    this.load.image('character5', 'assets/images/5.png');
    this.load.image('character6', 'assets/images/6.png');
    this.load.image('backImage', 'assets/images/png.png');
    this.load.image('waterDropImage', 'assets/images/Confetti.png');
    this.load.image('bgImage', 'assets/images/3690.jpg');
    this.load.image('infoIcon', 'assets/images/information.png');
    this.load.image('closeIcon', 'assets/images/close(1).png');
    this.load.image('panelBg', 'assets/images/11.png');

  }

  audioLoader() {
    this.load.audio('imageClickSound', 'assets/audios/Bubbly Button Sound.wav')
    this.load.audio('correctAnswerkSound', 'assets/audios/correct.mp3')
    this.load.audio('wrrongAnswerSound', 'assets/audios/wrong.mp3')
  }

    //#region Helper Methods
    //!================================Helper methods=================================!\\
  addImageToScene(locationX, locationY, imageName) {

    return this.add.image(locationX, locationY, imageName);

  }

  cardRevealedTweenAnimation(cardBackImage, characterImage) {
    this.tweens.add({
      targets   : cardBackImage,
      scaleX    : 0,
      duration  : 250,
      ease      : 'Linear',
      onComplete: () => {
        cardBackImage.setVisible(false);
        characterImage.setAlpha(1);
        this.tweens.add({
          targets       : characterImage,
          setDisplaySize: (100, 175),
          duration      : 250,
          ease          : 'Linear'
        });
      }
    });
  }

}

