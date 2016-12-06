/**
 * Created by mylesparker on 11/14/16.
 */

var frames = 0;
var kirby;
var canvas;
var renderingContext;
var width;
var height;
var states = {Splash: 0, Game: 1, Score: 2};
var currentState;
var score = 0;

var blocks;

var foregroundPosition = 0;

function blockCollection() {
    this._blocks = [];

    /**
     * Empty blocks array
     */
    this.reset = function () {
        this._blocks = [];
    };

    /**
     * Creates and adds a new block to the game.
     */
    this.add = function () {
        this._blocks.push(new Block()); // Create and push block to array
    };

    /**
     * Update the position of existing blocks and add new blocks when necessary.
     */
    this.update = function () {
        if (frames % 100 === 0) { // Add a new block to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._blocks.length; i < len; i++) { // Iterate through the array of blocks and update each.
            var block = this._blocks[i]; // The current block.

            if (i === 0) { // If this is the leftmost block, it is the only block that the fish can collide with . . .
                block.detectCollision(); // . . . so, determine if the fish has collided with this leftmost block.
            }

            block.x -= 3.2; // Each frame, move each block two pixels to the left. Higher/lower values change the movement speed.
            if (block.x < -block.width) { // If the block has moved off screen . . .
                this._blocks.splice(i, 1); // . . . remove it.
                i--;
                len--;
                score++;
                console.log(score);
            }
            // SOMEWHERE ADD THE SCORE UP
        }
    };

    /**
     * Draw all blocks to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._blocks.length; i < len; i++) {
            var block = this._blocks[i];
            block.draw();
        }
    };
}

function Block() {
    this.x = 500;
    this.y = height - (bottomBlockSprite.height + foregroundSprite.height + 110 + 200 * Math.random()); // change numbers 200 everywhere
    this.width = bottomBlockSprite.width;
    this.height = bottomBlockSprite.height;

    /**
     * Determines if the fish has collided with the block.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
        // intersection
        var cx = Math.min(Math.max(kirby.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(kirby.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(kirby.y, this.y + this.height + 110), this.y + 2 * this.height); // Change numbers 200 everywhere
        // Closest difference
        var dx = kirby.x - cx;
        var dy1 = kirby.y - cy1;
        var dy2 = kirby.y - cy2;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = kirby.radius * kirby.radius;
        // Determine intersection
        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };

    this.draw = function () {
        bottomBlockSprite.draw(renderingContext, this.x, this.y);
        topBlockSprite.draw(renderingContext, this.x, this.y + 110 + this.height); // change numbers 200 everywhere
    };
}

function Kirby() {
    this.frame = 0;
    this.animation = [0, 1];
    this.x = 150;
    this.y = 50;
    this.rotation = 0;
    this.radius = 12;
    this.velocity = 0;

    this.gravity = 0.25;
    this._jump = 4.6;

    this.jump = function () {
        this.velocity = -this._jump;
    };


    this.update = function () {
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if(currentState === states.Splash){
            this.updateIdleKirby();
        } else {
            this.updatePlayingKirby();
        }
    };

    this.updateIdleKirby = function () {
        this.y = height - 250 + 10 * Math.cos(frames / 10); // Play around with height (250) and cos (10)
        this.rotation = 0;
    };

    this.updatePlayingKirby = function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if(this.y >= height - foregroundSprite.height - 10){
            this.y = height - foregroundSprite.height - 10;
            if(currentState === states.Game){
                currentState = states.Score;
            }
            this.velocity = this._jump;
        }

        if(this.velocity >= this._jump){
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3); // Play around with the rotation number 0.3
        } else {
            this.rotation = 0; // Play around with rotation
        }
    };

    this.draw = function() {
        renderingContext.save();

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        if(currentState == states.Score){
           this.rotation = -0.3;
           kirbySprite[2].draw(renderingContext, -kirbySprite[2].width / 2, -kirbySprite[2].height / 2);
        } else {
            kirbySprite[n].draw(renderingContext, -kirbySprite[n].width / 2, -kirbySprite[n].height / 2);
        }

        renderingContext.restore();
    };
}

function main() {
    windowSetUp();
    canvasSetUp();
    loadGraphics();
    currentState = states.Splash;

    document.body.appendChild(canvas);

    kirby = new Kirby();
    blocks = new blockCollection();
}

function windowSetUp() {
    width = window.innerWidth;
    height = window.innerHeight;

    var inputEvent = "touchstart";
    if(width >= 500){
        width = 380;
        height = 430;
        inputEvent = "mousedown";
    }

    // Create a listener on the input event.

    document.addEventListener(inputEvent, onMouseDown);
}

function onMouseDown(evt) {
    switch(currentState){
        case states.Splash:
            currentState = states.Game;
            kirby.jump();
            break;
        case states.Game:
            kirby.jump();
            break;
        case states.Score:
            break;
    }
}

function canvasSetUp() {
    canvas = document.createElement("canvas");

    canvas.setAttribute("id", "myCanvas");
    canvas.style.border = "1px solid #382b1d";

    canvas.width = width;
    canvas.height = height;

    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    // Initiate the sprite sheet
    var img = new Image();
    img.src = "images/KirbysAdventureSheet1.png";
    img.onload = function() {
        initSprites(this);
        renderingContext.fillStyle = "#8BE4FD";
        // NOT NECESSARY kirbySprite[0].draw(renderingContext, 50, 50);
        gameLoop()
    };
}

function gameLoop() {
    update();
    render();

    window.requestAnimationFrame(gameLoop);
}

function update() {
    frames++;
    kirby.update();

    if(currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 3) % 27; /// Move left two px each frame. Wrap every 27px.
    }

    if(currentState === states.Game){
        blocks.update();
    }

    // console.log(frames);
}

function render() {
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite[0].draw(renderingContext, 0, height - backgroundSprite[0].height - 60);
    backgroundSprite[1].draw(renderingContext, width - backgroundSprite[1].width, height - backgroundSprite[1].height - 60);
    //backgroundSprite[2].draw(renderingContext, 150, height - backgroundSprite[2].height - 60);

    kirby.draw(renderingContext);
    blocks.draw(renderingContext);

    // drawing foreground

    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + (foregroundSprite.width * 2), height - foregroundSprite.height);
}
