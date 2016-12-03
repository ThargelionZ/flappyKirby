/**
 * Created by mylesparker on 11/14/16.
 */

var kirbySprite;
var backgroundSprite;
var foregroundSprite;

function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function(renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

function initSprites(img){
    kirbySprite = [
        new Sprite(img, 150, 190, 49, 48),
        new Sprite(img, 200, 190, 49, 48),
        new Sprite(img, 254, 71, 37, 39)
    ];

    backgroundSprite = [
        new Sprite(img, 387, 336, 173, 93),
        new Sprite(img, 559, 336, 170, 93),
        new Sprite(img, 327, 299, 55, 119)
    ];

    foregroundSprite = new Sprite(img, 48, 586, 144, 76);
}// X 48 W 146