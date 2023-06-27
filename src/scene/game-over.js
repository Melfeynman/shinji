import Phaser from "../lib/phaser.js";
import Start from './start.js';

const endScreen = document.querySelector('#end-screen');
const restartBtn = document.querySelector('.score-sqr');

export default class Over extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  create() {
    console.log('i am here');
    endScreen.style.display = 'flex';
    restartBtn.addEventListener('click', () => {
      this.scene.start('start');
    })
  }
}
