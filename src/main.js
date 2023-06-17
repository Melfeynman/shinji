import Phaser from './lib/phaser.js';

const vpwidth = window.innerWidth;
const vpheight = window.innerHeight;

export default new Phaser.Game ({
  type: Phaser.AUTO,
  width: vpwidth,
  height: vpheight,
  // scene,
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