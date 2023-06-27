import Phaser from '../lib/phaser.js';

const mainMenu = document.querySelector('#main-menu');

export default class Start extends Phaser.Scene {
  constructor() {
    super('start');
  }

  create() {
    mainMenu.style.display = 'flex';
  }
}