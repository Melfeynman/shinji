import Phaser from './lib/phaser.js';
import Start from './scene/start.js';
import Game from './scene/game.js';
import Over from './scene/game-over.js';

const vpwidth = window.innerWidth;
const vpheight = window.innerHeight;

// настройки игры
export default new Phaser.Game ({
  type: Phaser.AUTO,
  width: vpwidth,
  height: vpheight,
  scene: [Start, Game, Over],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200,
      },
      // визуализация направления движения и скорости
      // нужно заменить на false после завершения разработки
      debug: true,
    },
  },
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
})