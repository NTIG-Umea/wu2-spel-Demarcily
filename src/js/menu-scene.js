class PreloadScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.keyObj = this.input.keyboard.addKey('space', true, false);

        this.text = this.add.text(0, (this.game.config.height / 2) - 150, 'PAUSED', {
            fontFamily: '"Mochiy Pop P One"',
            fontSize: '64px',
            fill: '#ff0000',
            align: 'center',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });

        this.text = this.add.text(0, (this.game.config.height /2) - 64, `Arrow keys to move\nspace to start\nHighscore: ${localStorage.getItem('Hscore')}`, {
            fontFamily: '"Mochiy Pop P One"',
            fontSize: '32px',
            fill: '#ff0000',
            align: 'center',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        })
    }

    update() {
        if (this.keyObj.isDown) {
            this.scene.resume('PlayScene');
            this.scene.setVisible(false);
        }
    }


}

export default PreloadScene;
