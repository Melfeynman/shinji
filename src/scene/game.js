import Phaser from '../lib/phaser.js';
import Over from './game-over.js';

const vpwidth = window.innerWidth;
const vpheight = window.innerHeight;
const blockSize = Math.round(vpwidth * 0.05);
const mainMenu = document.querySelector('#main-menu');

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  background;
  // воображаемая грид-сетка для удобства создания карты. Содержит координаты центров ячеек
  gridCoordinates = { x: [], y: [] };
  blocks;
  camerasCenter;
  player;
  cursor;
  scoreLabel;
  score;
  startTime;
  timer = { mins: 0, secs: 0 };

  preload() {
    // надо заменить фон позднее
    this.load.image('background', 'assets/test-image.jpg');
    this.load.image('player-jump', 'assets/character/jump.png');
    this.load.spritesheet('player-run', 'assets/character/Punk_run.png', { frameWidth: 72, frameHeight: 48 });
  }

  create() {
    mainMenu.style.display = 'none';
    // запоминаем время начала игры
    this.startTime = Date.now();
    this.background = this.add.image(Math.round(vpwidth / 2), Math.round(vpheight / 2), 'background')
      .setScrollFactor(0.1, 0);
    // создаёт грид-сетку
    this.makeGrid();
    // объявляет группу статических элементов в this.blocks
    this.blocks = this.physics.add.staticGroup();
    // первый слой блоков
    this.staticMapGen(0);
    // второй слой блоков
    this.staticMapGen(1);

    // создаёт невидимый блок, за которым движется камера
    this.camerasCenter = this.physics.add.image()
      .setGravityY(-200)
      .setVisible(0)
      .setPosition(vpwidth / 2, vpheight / 2)
      .setVelocityX(200);
    this.cameras.main.startFollow(this.camerasCenter);

    // создаёт игрока
    this.createPlayer();
    // добавляет коллизию между игроком и блоками
    this.physics.add.collider(this.player, this.blocks);
    // this.timer = game.time.events.loop(this.rate, this.addObstacles, this);
    // this.Scoretimer = game.time.events.loop(100, this.incrementScore, this);
    // добавляет управление
    this.cursor = this.input.keyboard.createCursorKeys();
    // добавляет текст сётчика сверху
    this.score = this.createScore();
  }

  update() {
    // изменяет размер фона при изменении вьюпорта
    this.resizeBg(this.background);
    const mostRightGridX = this.gridCoordinates.x[this.gridCoordinates.x.length - 1];
    // проверяет посленюю колонку на наличие блоков и вызывает генератор
    this.checkLastGridColumn(mostRightGridX);

    // this.game.physics.arcade.collide(this.player, this.floor);
    // this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);

    var onTheGround = this.player.body.touching.down;

    // Если игрок коснулся земли, он получает 2 прыжка (можно поменять количество)
    if (onTheGround) {
      this.jumps = 2;
      this.jumping = false;
    }

    // Прыжок
    /*
    if (this.jumps > 0 && this.upInputIsActive(5)) {
      this.player.body.velocity.y = -1000;
      this.jumping = true;
    }
    */
    if (this.jumps > 0 && this.cursor.up.isDown) {
      this.player.setVelocityY(-200);
      this.jumping = true;
    }

    // Уменьшаем количество возможных прыжков после использования
    /*
    if (this.jumping && this.upInputReleased()) {
      this.jumps--;
      this.jumping = false;
    }
    */
    if (this.jumping && !this.cursor.up.isDown) {
      this.jumps--;
      this.jumping = false;
    }

    if (this.player.x < this.cameras.main.centerX) {
      this.player.setVelocityX(250);
    } else {
      this.player.setVelocityX(200);
    }

    // запускает секундомер
    this.countTime();
   
    if (this.player.x < this.cameras.main.scrollX - blockSize) {
      this.scene.start('game-over', { score: this.score });
    }
    
    if (this.player.y > this.cameras.main.scrollY + vpheight) {
      this.scene.start('game-over', { score: this.score });
    }
  }

  upInputIsActive(duration) {
    var isActive = false;

    isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
    isActive = (this.game.input.activePointer.justPressed(duration + 1000 / 60) &&
      this.game.input.activePointer.x > this.game.width / 4 &&
      this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);

    return isActive;
  }

  // Для подсчета прыгнул игрок или нет
  upInputReleased() {
    var released = false;

    released = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
    released = this.game.input.activePointer.justReleased();

    return released;
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
    // создаёт блоки по всем x и по указанному y
    for (let i = 0; i < this.gridCoordinates.x.length; i++) {
      const blockX = this.gridCoordinates.x[i];
      const blockY = this.gridCoordinates.y[yCount];
      this.blocks.create(blockX, blockY)
        .setSize(blockSize, blockSize)
        .setDisplaySize(blockSize, blockSize);
    }
  }

  dinamicMapGen(mostRightGridX) {
    let possibility = Math.random();
    // проходится по всей самой крайней колонке справа
    for (let i = 0; i < this.gridCoordinates.y.length; i++) {
      // с вероятность 0.1 создаёт в ячейке блок
      // в ходе продолжения игры можно увеливать вероятность до 0.5, чтобы было сложнее
      if (possibility > 0.9) {
        const blockX = this.cameras.main.scrollX + mostRightGridX;
        const blockY = this.gridCoordinates.y[i];
        this.blocks.create(blockX, blockY)
          .setSize(blockSize, blockSize)
          .setDisplaySize(blockSize, blockSize);
      }
      // генерирует новую вероятность
      possibility = Math.random();
    }
  }

  checkLastGridColumn(mostRightGridX) {
    let count = 0;
    const mostRightX = this.cameras.main.scrollX + mostRightGridX;
    // считает блоки, у которых правая граница находится в пределах последней колонки
    this.blocks.getChildren().map((block) => {
      if (block.x + blockSize >= mostRightX) count++;
    });
    // вызывает генератор, если таких блоков нет
    if (count === 0) {
      this.dinamicMapGen(mostRightGridX);
    };
  }

  createPlayer() {

    //this.player = this.physics.add.sprite(vpwidth / 5, vpheight -
    //	(this.tileHeight*2), 'player')
    //  .setSize(blockSize, blockSize);

    // помещает игрока в центр на высоту 3его блока, задаёт размер блока и скорость в 200
    const playerX = this.cameras.main.centerX;
    const playerY = this.gridCoordinates.y[2];
    this.player = this.physics.add.sprite(playerX, playerY, 'player-jump')
      .setOrigin(0, 0)
      .setScale(blockSize / 1000)
      .setDisplaySize(blockSize, blockSize)
      .setVelocityX(200);
    // this.player.originX = 0;
    // this.player.originY = 0;
    // this.player.setScale(4, 4);
    // this.player.anchor.setTo(0.5, 1.0); ?
    // this.game.physics.arcade.enable(this.player);

    // активирует физическое тело
    this.player.enableBody();
    // this.player.body.gravity.y = 2200;

    // запрещаем коллизию с границами мира, потому что иначе фигурка не преодолеет границы вьюпорта
    this.player.body.collideWorldBounds = false;
    this.player.body.bounce.y = 0.1;
    this.player.body.drag.x = 1;

    // здесь будет анимация (?)
    /*
    this.player.anims.create({
      key: 'walk',
      frames: this.player.anims.generateFrameNumbers('player-run', {
        start: 0,
        end: 3,
      }),
      duration: 1000,
      delay: 10,
      repeat: -1,
    }).setScale(blockSize / 72);
    this.player.anims.play('walk');
    */
  }

  createScore() {

    var scoreFont = "70px Arial";

    this.scoreLabel = this.add.text(this.cameras.main.leftX, 70, "0", { font: scoreFont, fill: "#fff" })
    this.scoreLabel.scrollFactorX = 0;
    // this.scoreLabel.anchor.setTo(0.5, 0.5);
    this.scoreLabel.align = 'center';
    // this.game.world.bringToTop(this.scoreLabel);
    this.scoreLabel.y = this.gridCoordinates.y.length - 2;
    this.scoreLabel.depth = 100;

    //*
  }

  countTime() {
    // сравнивает текущее время с сохранённым временем начала игры
    // и выводит в this.scoreLabel отформатированную разницу
    const diff = new Date(Date.now() - this.startTime);
    const strDiff = diff.toString();
    this.timer.mins = diff.getMinutes();
    this.timer.secs = diff.getSeconds();
    this.score = this.timer.mins * 60 + this.timer.secs;
    this.scoreLabel.text = `Счет: ${this.score}`;
  }
}
