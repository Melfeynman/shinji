import Phaser from '../lib/phaser.js';
import Game from './game.js';

const mainMenu = document.querySelector('#main-menu');
const startBtn = document.querySelector('.start-btn');

export default class Start extends Phaser.Scene {
  constructor() {
    super('start');
  }

  create() {
    // показывает .wrapper c главным меню
    mainMenu.style.display = 'flex';
    // начинает новую сцену по клику на кнопку начала игры
    startBtn.addEventListener('click', () => {
      this.scene.start('game');
    });
  }
}

// "d:\Users\User-1\Desktop\shinji\mainGame.html"