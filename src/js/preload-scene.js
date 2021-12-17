class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL('/assets');
        this.load.image('icicle', '/images/icicle.png');
        this.load.image('background', '/images/background.png');
        this.load.atlas('player', '/images/player.png', '/images/player.json');
        this.load.spritesheet('food', '/images/food.png', {frameWidth: 64, frameHeight: 64}, );
        this.load.image('tiles', '/tilesets/christmasTileset.png');
        // här laddar vi in en tilemap med spelets "karta"
        this.load.tilemapTiledJSON('map', '/tilemaps/level1.json');
    }

    create() {
        this.scene.start('PlayScene');
    }
}


export default PreloadScene;