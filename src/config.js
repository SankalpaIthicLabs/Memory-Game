import Phaser from 'phaser';
import { GamePlayScene } from './gameplayScene';
import { MainMenu } from './mainMenu';
import { PlayerWon } from './playerWon';
import { PlayerLost } from './playerLoss';

//#endregion
export const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  scene: [MainMenu,GamePlayScene,PlayerWon,PlayerLost],
  canvas: gameCanvas,
};

const game = new Phaser.Game(config);


