import Phaser from "../lib/phaser.js";
import Start from './start.js';

const endScreen = document.querySelector('#end-screen');
const restartBtn = document.querySelector('.score-sqr');

export default class Over extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  init(data) {
    this.finalScore = data.score;

  }

  create() {
    //console.log('i am here');
    const vpwidth = window.innerWidth;
    const vpheight = window.innerHeight;

    /*тут после add.text первымы двумя параметрами должны идти параметры расположения по иску и игрику, 
    по какой то причине когда эти параметры заезжают в то место где они должны быть (в центре) счет пропадает, хотя если поставить параметры
    рандомные, например 10 и 10 счет становится виден*/
    this.txt_score = this.add.text(vpwidth / 2, vpheight / 2, 'Ваш счет: ' + this.finalScore, { fontSize: "70px Arial", fill: '#fff'});
    this.txt_score.depth = 100;
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
