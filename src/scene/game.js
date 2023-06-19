import Phaser from '../lib/phaser.js';

const vpwidth = window.innerWidth;
const vpheight = window.innerHeight;
const blockSize = Math.round(vpwidth * 0.05);

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  background;

  preload() {
    this.load.image('background', 'assets/test-image.jpg');
  }

  create() {
    this.background = this.add.image(Math.round(vpwidth / 2) , Math.round(vpheight / 2), 'background')
  }

  update() {
    this.resizeBg(this.background);
  }

  resizeBg(bg) {
    vpwidth > vpheight ? bg.setDisplaySize(vpwidth, vpwidth) : bg.setDisplaySize(vpheight, vpheight);
  }
}
