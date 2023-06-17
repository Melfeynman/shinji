import Phaser from './lib/phaser.js';
import Game from './scene/Game.js';

// узнаём размеры вьюпорта
const vpwidth = window.innerWidth;
const vpheight = window.innerHeight;

// задаём настройки игры
export default new Phaser.Game({
  // выбираем автоматический выбор отображения
  type: Phaser.AUTO,
  // задаём размеры канваса
  width: vpwidth,
  height: vpheight,
  // сюда будем помещать созданные игровые сцены
  scene: ['start', 'game', 'game-over'],
  // физика
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