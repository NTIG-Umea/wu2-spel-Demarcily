class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.score = 0;

        this.add.image(0, 0, 'background').setOrigin(0, 0);

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('jefrens_platformer', 'tiles');

        this.initAnims();

        this.cursors = this.input.keyboard.createCursorKeys();

        

        this.platforms = map.createLayer('Platforms', tileset);
        this.platforms.setCollisionByExclusion(-1, true);
       
        this.player = this.physics.add.sprite(50, 416, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.foods = this.physics.add.group({
            key: 'food',
            repeat: 13,
            setXY: { x: 30, y: 0, stepX: 70 }
        });

        this.foods.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
        });


        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.foods, this.platforms);
        this.physics.add.overlap(this.player, this.foods, this.collectFood, null, this);

        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
        this.updateText();

        this.keyObj = this.input.keyboard.addKey('W', true, false);

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
        if (this.keyObj.isDown) {
            this.scene.pause();
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

        if (
            (this.cursors.space.isDown || this.cursors.up.isDown) &&
            this.player.body.onFloor()
        ) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(true);
        }
    }

    updateText() {
        this.text.setText(
            `W to pause. Score: ${this.score}`
        );
    }

    initAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'jefrens_',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'jefrens_2' }],
            frameRate: 10
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'jefrens_5' }],
            frameRate: 10
        });
    }
    
    collectFood(player, food) {
        food.disableBody(true, true);
        this.score += 10;
        this.updateText();

        if (this.foods.countActive(true) === 0) {
            this.foods.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }
}

export default PlayScene;