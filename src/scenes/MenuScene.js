export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('start-button', 'assets/newgrounds.svg');
    }

    create() {
        // Crear el botón en el centro de la pantalla
        const button = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'start-button'
        ).setInteractive();

        // Hacer el botón interactivo
        button.on('pointerup', () => {
            this.scene.start('MainScene');
        });

        // Efectos hover opcionales
        button.on('pointerover', () => {
            button.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(1);
        });
    }
}