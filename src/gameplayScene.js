import { config } from './config';
import './style.css';
import Phaser, { Game } from 'phaser';

export class GamePlayScene extends Phaser.Scene {
  constructor() {
    super('GamePlayScene');
    this.emitter
  }

  preload() {
    this.imageLoader();
    this.audioLoader();
  }

  create() {
    this.add.image(400,300,'bgImage');
    this.cardGenerator();
    
  }

  update() { }

  // !=============================Sub Methods===============================!\\



  cardGenerator() {
    let cols = 3;
    let rows = 2;
    let startX = 250;
    let startY = 150;
    let spacingX = 150;
    let spacingY = 200;

    let matchedPairs = 0;
    let maxPairs = 3;

    let firstClick = null;
    let secondClick = null;

    let cards = [];

    let characterImages = ['character1', 'character2', 'character3', 'character4', 'character5', 'character6'];

    //? Randomly select 3 images from the available list
    let selectedImages = Phaser.Utils.Array.Shuffle(characterImages).slice(0, 3);

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
        .setDisplaySize(100,175)
        .setOrigin(0.5, 0.5)
        .setInteractive();

      let characterImage = this.addImageToScene(cardBackImage.x, cardBackImage.y, imagePairs[index])
        .setDisplaySize(100,175)
        .setOrigin(0.5, 0.5);

      index++;

      cards.push({ cardBackImage, characterImage });

      // Initially hide the character image
      cardBackImage.setVisible(false);
    });

    // **STEP 1: SHOW CARDS FOR MEMORIZATION**
    this.time.delayedCall(500, () => {
      cards.forEach(({ characterImage }) => {
        this.tweens.add({
          targets: characterImage,
          alpha: 1,
          duration: 500
        });
      });

      // **STEP 2: FLIP THEM BACK AFTER 2 SECONDS**
      this.time.delayedCall(1000, () => {
        cards.forEach(({ cardBackImage, characterImage }) => {
          this.tweens.add({
            targets: characterImage,
            alpha: 0,
            duration: 500,
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
  let emitter = this.add.particles (0,0,"waterDropImage", {
    x:pointer.x,
    y:pointer.y,
    speed: 100,
    gravityY: 300 - 200,
    scale:0.04,
    duration: 100,
    emitting: false,
    });

  emitter.start(pointer.x,pointer.y,1000)

  this.time.delayedCall(500, () => {
      emitter.stop(); // Stop emission instead of destroying particles
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
                  console.log("Same image clicked twice!");
                
                  // Store references to matched images
                  let matchedCards = cards.filter(c => c.characterImage.texture.key === firstClick);
                
                  // Animate matched cards

                  this.time.delayedCall(750,()=>{

                  matchedCards.forEach(({ cardBackImage, characterImage }) => {
                    this.tweens.add({
                      targets: [cardBackImage, characterImage],
                      scaleX: 0.3,
                      scaleY: 0.4,
                      // alpha: 0,
                      duration: 75,
                      ease: 'Linear',
                      onComplete: () => {

                        this.tweens.add({
                        targets: [cardBackImage, characterImage],
                        scaleX: 0,
                        scaleY: 0,
                        alpha: 0,
                        duration: 150,
                        ease: 'Linear',
                        onComplete:()=>{
                          cardBackImage.setVisible(false);
                        characterImage.setVisible(false);
                        }
                      }
                    )}
                    });
                  });
                });
                  firstClick = null;
                  secondClick = null;
                
                  if (matchedPairs == maxPairs) {
                    console.log("Player won");
                    this.time.delayedCall(2000, () => {
                      this.scene.start("PlayerWon");
                    });
                  }
                }else {
  console.log("Different images clicked. player loss");

  this.tweens.add({
    targets: [cardBackImage, characterImage],
    x: `+=10`,
    duration: 100,
    yoyo: true,
    repeat: 3,
    ease: 'Linear',
    onComplete: () => {
      cardBackImage.x -= 10;
      characterImage.x -= 10;
    }
  });

  // Delay before losing screen
  this.time.delayedCall(2000, () => {
    this.scene.start("PlayerLost");
  });
}


                // Reset for next check
                firstClick = null;
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
    this.load.image('character1', 'assets/1.png');
    this.load.image('character2', 'assets/2.png');
    this.load.image('character3', 'assets/3.png');
    this.load.image('character4', 'assets/4.png');
    this.load.image('character5', 'assets/5.png');
    this.load.image('character6', 'assets/6.png');
    this.load.image('backImage', 'assets/png.png');
    this.load.image('waterDropImage', 'assets/wtdrop.png');
    this.load.image('bgImage','assets/3690.jpg');
  }

  audioLoader() {
    this.load.audio('imageClickSound', 'assets/audios/Bubbly Button Sound.wav')
  }

  //#region Helper Methods
  //!================================Helper methods=================================!\\
  addImageToScene(locationX, locationY, imageName) {

    return this.add.image(locationX, locationY, imageName);

  }

  cardRevealedTweenAnimation(cardBackImage, characterImage) {
    this.tweens.add({
      targets: cardBackImage,
      scaleX: 0,
      duration: 250,
      ease: 'Linear',
      onComplete: () => {
        cardBackImage.setVisible(false);
        characterImage.setAlpha(1);
        this.tweens.add({
          targets: characterImage,
          setDisplaySize: (100,175),
          duration: 250,
          ease: 'Linear'
        });
      }
    });
  }

}

// config.scene = [GameScene]
// const game = new Phaser.Game(config);
