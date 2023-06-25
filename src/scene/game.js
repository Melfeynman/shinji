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
  camerasCenter;

  preload() {
    // надо заменить фон позднее
    this.load.image('background', 'assets/test-image.jpg');
  }

  create() {
    this.background = this.add.image(Math.round(vpwidth / 2) , Math.round(vpheight / 2), 'background')
      .setScrollFactor(1, 0);
    // создаёт грид-сетку
    this.makeGrid();
    console.log(this.gridCoordinates);
    // объявляет группу статических элементов в this.blocks
    this.blocks = this.physics.add.staticGroup();
    // первый слой блоков
    this.staticMapGen(0);
    // второй слой блоков
    this.staticMapGen(1);

    this.camerasCenter = this.physics.add.image()
      .setGravityY(-200)
      .setVisible(0)
      .setPosition(vpwidth / 2, vpheight / 2)
      .setVelocityX(200);

    this.cameras.main.startFollow(this.camerasCenter);

    this.createPlayer();
    this.createScore();
    this.timer = game.time.events.loop(this.rate, this.addObstacles, this);
		this.Scoretimer = game.time.events.loop(100, this.incrementScore, this);
  }

  update() {
    // изменяет размер фона при изменении вьюпорта
    this.resizeBg(this.background);
    const mostRightGridX = this.gridCoordinates.x[this.gridCoordinates.x.length - 1];
    // проверяет посленюю колонку на наличие блоков и вызывает генератор
    this.checkLastGridColumn(mostRightGridX);

    this.game.physics.arcade.collide(this.player, this.floor);
		this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);

		var onTheGround = this.player.body.touching.down;

		// Если игрок коснулся земли, он получает 2 прыжка (можно поменять количество)
		if (onTheGround) {
			this.jumps = 2;
			this.jumping = false;
		}

		// Прыжок
		if (this.jumps > 0 && this.upInputIsActive(5)) {
			this.player.body.velocity.y = -1000;
			this.jumping = true;
		}

		// Уменьшаем количество возможных прыжков после использования
		if (this.jumping && this.upInputReleased()) {
			this.jumps--;
			this.jumping = false;
		}
  }


  upInputIsActive(duration) {
		var isActive = false;

		isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
		isActive |= (this.game.input.activePointer.justPressed(duration + 1000 / 60) &&
			this.game.input.activePointer.x > this.game.width / 4 &&
			this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);

		return isActive;
	}

	// Для подсчета прыгнул игрок или нет
	upInputReleased() {
		var released = false;

		released = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
		released |= this.game.input.activePointer.justReleased();

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
    console.log('someone has called me');
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
        console.log('i have just ganerated a new block!');
      }
      // генерирует новую вероятность
      possibility = Math.random();
    }
  }

  checkLastGridColumn(mostRightGridX) {
    console.log('fn is on its watch');
    let count = 0;
    const mostRightX = this.cameras.main.scrollX + mostRightGridX;
    // считает блоки, у которых правая граница находится в пределах последней колонки
    this.blocks.getChildren().map((block) => {
      if (block.x + blockSize >= mostRightX) count++;
    });
    // вызывает генератор, если таких блоков нет
    if (count === 0) {
      console.log('i work');
      this.dinamicMapGen(mostRightGridX);
    };
  }

  createPlayer() {

		this.player = this.game.add.sprite(this.game.world.width/5, this.game.world.height -
			(this.tileHeight*2), 'player');
		this.player.scale.setTo(4, 4);
		this.player.anchor.setTo(0.5, 1.0);
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 2200;
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.y = 0.1;
		this.player.body.drag.x = 150;
		var walk = this.player.animations.add('walk');
		this.player.animations.play('walk', 20, true);
  }

  createScore() {

		var scoreFont = "70px Arial";

		this.scoreLabel = this.game.add.text(this.game.world.centerX, 70, "0", { font: scoreFont, fill: "#fff" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);

		this.highestScore = this.game.add.text(this.game.world.centerX * 1.6, 70, "0", { font: scoreFont, fill: "#fff" });
		this.highestScore.anchor.setTo(0.5, 0.5);
		this.highestScore.align = 'right';
		this.game.world.bringToTop(this.highestScore);

		if (window.localStorage.getItem('Highest Score') == null) {
			this.highestScore.setText(0);
			window.localStorage.setItem('Highest Score', 0);
		}
		else {
			this.highestScore.setText(window.localStorage.getItem('Highest Score'));
		}
	}

	incrementScore() {

		score += 1;
		this.scoreLabel.setText(score);
		this.game.world.bringToTop(this.scoreLabel);
		this.highestScore.setText("HS: " + window.localStorage.getItem('Highest Score'));
		this.game.world.bringToTop(this.highestScore);
	}

}
