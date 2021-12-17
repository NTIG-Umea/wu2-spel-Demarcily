class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.score = 0;
        this.gameOver = false;
        this.lives = 3;
        this.spawnRate = 0;

        if (localStorage.getItem('Hscore') == null) {
            localStorage.setItem('Hscore', 0);
        }

        this.add.image(0, 0, 'background').setOrigin(0, 0);

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('christmasTileset', 'tiles');

        this.initAnims();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.platforms = map.createLayer('Platform', tileset);
        this.platforms.setCollisionByExclusion(-1, true);
       
        this.player = this.physics.add.sprite(50, 416, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.foods = this.physics.add.group({
            
        });

        for (let y = 0; y <= 13; y++) {
            this.food = this.foods.create(25 + (y*70), 0, 'food').setScale(0.5);
            this.random = Math.round(Phaser.Math.Between(0, 10));
            this.food.anims.play(this.random+"", true);
        }

        this.foods.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });

        this.icicles = this.physics.add.group();
        
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.foods, this.platforms);
        this.physics.add.collider(this.icicles, this.platforms, this.destroyIcicle, null, this);

        this.physics.add.overlap(this.player, this.foods, this.collectFood, null, this);
        this.playerHitbox = this.physics.add.overlap(this.player, this.icicles, this.hitBomb, null, this);

        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
        this.updateText();

        this.keyObj = this.input.keyboard.addKey('space', true, false);
        this.keyReset = this.input.keyboard.addKey('R', true, false);

        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });

        this.scene.pause();
        this.scene.launch('MenuScene');
    }

    update() {
        if (this.keyReset.isDown) {
            this.updateScore();
            this.score = 0;
            this.spawnRate = 0;
            this.lives = 3;
            this.gameover = false;
            this.player.setPosition(50, 416);
            this.foods.children.iterate(function (child) {
                if(child != null){
                    child.disableBody(true, true);
                }
            });
            this.foods.children.iterate(function (child) {
                let random = Math.round(Phaser.Math.Between(0, 10));
                child.anims.play(random+"", true);
                child.enableBody(true, child.x, 0, true, true);
            });
            this.updateText();
            
        }

        if (this.gameOver) {
            return;
        }

        if (this.keyObj.isDown) {
            this.scene.pause();
            this.updateScore();
            this.scene.launch('MenuScene');
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            this.player.setVelocityX(0);
            
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-250);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(true);
        }

        if (Math.random() * 10 > 10 - this.spawnRate) {
            this.spawnIcicle();
        }
    }

    updateText() {
        this.text.setText(
            `R to reset. space to pause. Score: ${this.score}. Lives: ${this.lives}`
        );
    }

    initAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'walk_',
                start: 1,
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'idle_',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'jump_',
                start: 1,
                end: 3
            }),
            frameRate: 10
        });

        this.anims.create({
            key: '0',
            frames: [{ key: 'food', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: '1',
            frames: [{ key: 'food', frame: 1 }],
            frameRate: 20
        });
        this.anims.create({
            key: '2',
            frames: [{ key: 'food', frame: 2 }],
            frameRate: 20
        });
        this.anims.create({
            key: '3',
            frames: [{ key: 'food', frame: 3}],
            frameRate: 20
        });
        this.anims.create({
            key: '4',
            frames: [{ key: 'food', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: '5',
            frames: [{ key: 'food', frame: 5 }],
            frameRate: 20
        });
        this.anims.create({
            key: '6',
            frames: [{ key: 'food', frame: 6 }],
            frameRate: 20
        });
        this.anims.create({
            key: '7',
            frames: [{ key: 'food', frame: 7 }],
            frameRate: 20
        });
    }
    
    collectFood(player, food) {
        food.disableBody(true, true);
        this.score += 10;
        this.updateText();

        if (this.foods.countActive(true) == 0) {
            this.foods.children.iterate(function (child) {
                let random = Math.round(Phaser.Math.Between(0, 10));
                child.anims.play(random+"", true);
                child.enableBody(true, child.x, 0, true, true);
                
            });
            this.spawnRate += 0.1;
        }
    }

    hitBomb(player, icile) {
        this.physics.world.removeCollider(this.playerHitbox);
        this.lives -= 1;
        this.updateText();
    
        if (this.lives > 0) {
            this.tweens.add({
                targets: player,
                alpha: { start: 0, to: 1 },
                tint: { start: 0xff0000, to: 0xffffff },
                duration: 100,
                ease: 'Linear',
                repeat: 5
            });
        } else {
            this.physics.pause();
            this.gameOver = true;
            this.player.setTint(0xff0000);
            this.updateScore();
        }
        var timer = this.time.addEvent({
            delay: 3000,          
            callback: this.restoreHitbox,
            callbackScope: this,
        });
       
    }

    updateScore() {
        if (this.score > localStorage.getItem('Hscore')) {
            localStorage.setItem('Hscore', this.score);
        }
    }

    spawnIcicle() {
        var x = Phaser.Math.Between(0, 960);

        this.icicle = this.icicles.create(x, 0, 'icicle');
        this.icicle.setVelocity(Phaser.Math.Between(-50, 25), 15);
        this.icicle.allowGravity = false;
    }

    destroyIcicle(icicle, platform) {
        icicle.destroy();
    }

    restoreHitbox() {
        this.playerHitbox = this.physics.add.overlap(this.player, this.icicles, this.hitBomb, null, this);
    }
}

export default PlayScene;