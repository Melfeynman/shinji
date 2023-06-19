import Phaser from '../src/lib/phaser.js';

export default class Block extends Phaser.GameObjects.Graphics {
  constructor(scene, { x, y }) {
    super(scene, { x, y });
  }
}