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

    //this.showScore();
  }

  /*showScore() {
    var scoreFont = "60px Arial";

		this.scoreLabel = this.game.add.text(this.game.centerX, this.game.centerY / 2, "0", { font: scoreFont, fill: "#fff" });
		this.scoreLabel.align = 'center';
		this.scoreLabel.text = "Your score is " + (score);
  }*/
}
