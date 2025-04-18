import { auth, provider, signInWithPopup } from './services/firebaseConfig.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('background', 'assets/stageback.png');
        this.load.image('google-btn', 'assets/ready.png');
        this.load.image('start-btn', 'assets/go.png');
    }

    create() {
        // Add the background image
        const background = this.add.image(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'background'
        );
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Add Google Sign-in button
        const googleButton = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'google-btn'
        ).setInteractive();

        // Create start button but keep it hidden initially
        this.startButton = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'start-btn'
        )
        .setInteractive()
        .setVisible(false);

        // Add click handler for Google sign-in
        googleButton.on('pointerup', () => {
            this.handleGoogleSignIn();
        });

        // Add click handler for start button
        this.startButton.on('pointerup', () => {
            this.startGame();
        });

        // Add hover effects for both buttons
        [googleButton, this.startButton].forEach(button => {
            button.on('pointerover', () => button.setScale(1.1));
            button.on('pointerout', () => button.setScale(1.0));
        });

        // Check if user is already signed in
        auth.onAuthStateChanged((user) => {
            if (user) {
                googleButton.setVisible(false);
                this.startButton.setVisible(true);
            } else {
                googleButton.setVisible(true);
                this.startButton.setVisible(false);
            }
        });
    }

    async handleGoogleSignIn() {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Successfully signed in:', user.displayName);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }

    startGame() {
        this.scene.start('GameScene');
    }
}