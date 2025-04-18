import { auth, database, ref, set, onValue, remove } from '../services/firebaseConfig.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.players = new Map(); // Almacenar todos los jugadores
    }

    getRandomColor() {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00, 0x00ffff];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    create() {
        // Obtener el usuario actual
        const user = auth.currentUser;
        this.userId = user ? user.uid : 'guest-' + Math.random().toString(36).substring(7);
        const userName = user ? user.displayName : 'Guest';

        // Configurar físicas
        this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Crear el piso con físicas correctas
        this.ground = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.height - 50,
            this.cameras.main.width,
            20,
            0x00ff00
        );
        
        // Agregar físicas al piso y hacerlo estático
        this.physics.add.existing(this.ground, true);
        this.ground.body.moves = false;
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true; // Importante para que el piso no se mueva
        this.ground.body.friction = 1; // Correct way to set friction

        // Crear el jugador local
        this.createPlayer(this.userId, userName, this.cameras.main.centerX, 300); // Posición Y más arriba

        // Sincronizar con Firebase
        this.setupFirebaseSync();
    }

    createPlayer(playerId, playerName, x, y) {
        const player = {
            sprite: this.add.rectangle(x, y, 50, 50, this.getRandomColor()),
            nameText: this.add.text(x, y - 40, playerName, {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 3, y: 3 }
            })
        };

        player.nameText.setOrigin(0.5);

        if (playerId === this.userId) {
            // Configuración mejorada de físicas del jugador
            this.physics.add.existing(player.sprite);
            player.sprite.body.setCollideWorldBounds(true);
            player.sprite.body.setBounce(0.1);
            player.sprite.body.setGravityY(300);
            player.sprite.body.setSize(50, 50); // Asegurar que el tamaño del cuerpo físico coincida
            player.sprite.body.setDrag(100, 0); // Add drag for smoother movement
            
            // Agregar colisionador ANTES de asignar localPlayer
            this.physics.add.collider(player.sprite, this.ground);
            this.localPlayer = player;
        }

        this.players.set(playerId, player);
        return player;
    }

    setupFirebaseSync() {
        const gameRef = ref(database, 'games/default/players');

        // Actualizar posición del jugador local
        setInterval(() => {
            if (this.localPlayer) {
                set(ref(database, `games/default/players/${this.userId}`), {
                    x: this.localPlayer.sprite.x,
                    y: this.localPlayer.sprite.y,
                    name: auth.currentUser ? auth.currentUser.displayName : 'Guest'
                });
            }
        }, 50);

        // Escuchar cambios de otros jugadores
        onValue(gameRef, (snapshot) => {
            const players = snapshot.val() || {};
            
            // Actualizar o crear otros jugadores
            Object.entries(players).forEach(([id, data]) => {
                if (id !== this.userId) {
                    if (!this.players.has(id)) {
                        this.createPlayer(id, data.name, data.x, data.y);
                    } else {
                        const player = this.players.get(id);
                        player.sprite.x = data.x;
                        player.sprite.y = data.y;
                        player.nameText.setPosition(data.x, data.y - 40);
                    }
                }
            });
        });

        // Limpiar al desconectar
        window.addEventListener('beforeunload', () => {
            remove(ref(database, `games/default/players/${this.userId}`));
        });
    }

    update() {
        if (this.localPlayer && this.localPlayer.sprite.body) {
            // Actualizar posición del nombre
            this.localPlayer.nameText.setPosition(this.localPlayer.sprite.x, this.localPlayer.sprite.y - 40);

            const cursors = this.input.keyboard.createCursorKeys();
            const MOVEMENT_SPEED = 200;
            const JUMP_SPEED = -350;

            // Control horizontal
            if (cursors.left.isDown) {
                this.localPlayer.sprite.body.setVelocityX(-MOVEMENT_SPEED);
            } else if (cursors.right.isDown) {
                this.localPlayer.sprite.body.setVelocityX(MOVEMENT_SPEED);
            } else {
                this.localPlayer.sprite.body.setVelocityX(0);
            }

            // Control de salto mejorado
            if (cursors.up.isDown && this.localPlayer.sprite.body.touching.down) {
                this.localPlayer.sprite.body.setVelocityY(JUMP_SPEED);
            }
        }
    }
}