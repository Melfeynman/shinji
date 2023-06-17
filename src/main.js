import Phaser from './lib/phaser.js';
import Game from './scene/game.js';

const vpwidth = window.innerWidth;
const vpheight = window.innerHeight;

export default new Phaser.Game ({
  type: Phaser.AUTO,
  width: vpwidth,
  height: vpheight,
  scene: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200,
      },
      debug: true,
    },
  },
})