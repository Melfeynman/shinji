import Phaser from '../lib/phaser.js';

const vpwidth = window.innerWidth;
const vpheight = window.innerHeight;
const blockSize = Math.round(vpwidth * 0.05);

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  background;
  // воображаемая грид-сетка для удобства создания карты. Содержит координаты центров ячеек
  gridCoordinates = { x: [], y: [] };
  blocks;

  preload() {
    // надо заменить фон позднее
    this.load.image('background', 'assets/test-image.jpg');
  }

  create() {
    this.background = this.add.image(Math.round(vpwidth / 2) , Math.round(vpheight / 2), 'background');
    // создаёт грид-сетку
    this.makeGrid();
    console.log(this.gridCoordinates);
    // объявляет группу статических элементов в this.blocks
    this.blocks = this.physics.add.staticGroup();
    // первый слой блоков
    this.staticMapGen(0);
    // второй слой блоков
    this.staticMapGen(1);
  }

  update() {
    // изменяет размер фона при изменении вьюпорта
    this.resizeBg(this.background);

    const mostRightGridX = this.gridCoordinates.x[this.gridCoordinates.x.length - 1];
    // место для dinamicMapGen()
  }

  resizeBg(bg) {
    vpwidth > vpheight ? bg.setDisplaySize(vpwidth, vpwidth) : bg.setDisplaySize(vpheight, vpheight);
  }

  makeGrid() {
    this.gridCoordinates.x = [];
    this.gridCoordinates.y = [];
    const columnsCount = Math.floor(vpwidth / blockSize) + 1;
    const rowsCount = Math.floor(vpheight / blockSize) + 1;
    let steps = 0 - blockSize / 2;
    for (let i = 1; i <= columnsCount; i++) {
      this.gridCoordinates.x.push(steps += blockSize);
    }
    steps = vpheight + blockSize / 2;
    for (let i = 1; i <= rowsCount; i++) {
      this.gridCoordinates.y.push(steps -= blockSize);
    }
  }

  staticMapGen(yCount) {
    for (let i = 0; i < this.gridCoordinates.x.length; i++) {
      const blockX = this.gridCoordinates.x[i];
      const blockY = this.gridCoordinates.y[yCount];
      this.blocks.create(blockX, blockY)
        .setSize(blockSize, blockSize)
        .setDisplaySize(blockSize, blockSize);
    }
  }

  dinamicMapGen() {
    let possibility = Math.random();
    console.log(possibility);
    // проходится по всей самой крайней колонке справа
    for (let i = 0; i < this.gridCoordinates.y.length; i++) {
      // с вероятность 0.5 создаёт в ячейке блок
      if (possibility > 0.5) {
        console.log(possibility);
        const blockY = this.gridCoordinates.y[i];
        this.blocks.create(mostRightGridX, blockY)
          .setSize(blockSize, blockSize)
          .setDisplaySize(blockSize, blockSize);
      }
      // генерирует новую вероятность
      possibility = Math.random();
    }
  }
}
