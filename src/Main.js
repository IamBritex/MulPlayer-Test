import { MainScene } from './MainScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';

let config = {
    autoFocus: true,
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    scene: [MenuScene, MainScene, GameScene],  
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,
        fullscreenTarget: 'game-container',
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },  // Set default gravity
            debug: true // Útil para ver las colisiones mientras desarrollas
        }
    }
};

window.game = new Phaser.Game(config);