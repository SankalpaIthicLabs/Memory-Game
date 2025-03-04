import Phaser from 'phaser';
import { GamePlayScene } from './gameplayScene.js';
import { MainMenu } from './mainMenu.js';
import { PlayerWon } from './playerWon.js';
import { PlayerLost } from './playerLoss.js';

//#endregion
export const config = {
  type: Phaser.WEBGL,
  width: 640,
  height: 360,
  scene: [MainMenu,GamePlayScene,PlayerWon,PlayerLost],
  canvas: gameCanvas,
};

const game = new Phaser.Game(config);


