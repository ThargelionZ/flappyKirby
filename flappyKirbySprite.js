/**
 * Created by mylesparker on 11/14/16.
 */

var kirbySprite;
var backgroundSprite;
var foregroundSprite;
var topBlockSprite;
var bottomBlockSprite;
var okButtonSprite;
var tapInstructionsSprite;

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

    topBlockSprite = new Sprite(img, 441, 19, 38, 270);
    bottomBlockSprite = new Sprite(img, 441, 19, 38, 270);

    backgroundSprite = [
        new Sprite(img, 387, 336, 171, 93),
        new Sprite(img, 559, 336, 170, 93),
        new Sprite(img, 327, 299, 55, 119)
    ];

    okButtonSprite = new Sprite(img, 507, 255, 82, 29);

    tapInstructionsSprite = new Sprite(img, 608, 214, 94, 74);

    foregroundSprite = new Sprite(img, 48, 586, 144, 76);
}// X 48 W 146