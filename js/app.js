'use strict';

// Const variables
var CELL_WIDTH = 101;
var CELL_HEIGHT = 83;

// Helper function for getting random integer number
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.level = 0;
    this.x = getRandomIntInclusive(0, 505);
    this.y = CELL_HEIGHT * getRandomIntInclusive(1, 3);
    this.speed = getRandomIntInclusive(100 + 20 * this.level, 300 + 20 * this.level);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.x = 0 - CELL_WIDTH;
        this.y = CELL_HEIGHT * getRandomIntInclusive(1, 3);
        this.speed = getRandomIntInclusive(100 + 50 * this.level, 300 + 50 * this.level);
    }
};

Enemy.prototype.reset = function() {
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkCollision = function(player) {
    if (this.y === player.y) {
        if (((this.x + CELL_WIDTH - 25) >= player.x) && ((player.x + CELL_WIDTH - 25) >= this.x)) {
            return true;
        }
    }
    return false;
};

var characters = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.charIndex = 0;    
    this.sprite = characters[this.charIndex];
    this.row = 5;
    this.col = 2;
    this.x = this.col * CELL_WIDTH;
    this.y = this.row * CELL_HEIGHT;
};

// Update the actual position of player on canvas
Player.prototype.update = function() {
    this.x = this.col * CELL_WIDTH;
    this.y = this.row * CELL_HEIGHT;
};

// For changing the character image of player
Player.prototype.changeChar = function(direction) {
    if (direction === 'left') {
        this.charIndex--;
    } else if (direction === 'right') {
        this.charIndex++;
    }
    this.charIndex = this.charIndex % characters.length;
    if (this.charIndex < 0) {
        this.charIndex += 5;
    }
    this.sprite = characters[this.charIndex];
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.moveLeft = function () {
    if (this.col > 0) {
        this.col--;
    }
};

Player.prototype.moveRight = function () {
    if (this.col < 4) {
        this.col++;
    }
};

Player.prototype.moveUp = function () {
    if (this.row > 0) {
        this.row--;
    }
};

Player.prototype.moveDown = function () {
    if (this.row < 5) {
        this.row++;
    }
};

Player.prototype.reset = function () {
    /*
    this.row = 5;
    this.col = 2;
    */
};

var Gem = function (color, row, col) {
    if (color === 'green') {
        this.sprite = 'images/Gem Green.png';
        this.score = 100;
    } else if (color === 'blue') {
        this.sprite = 'images/Gem Blue.png';
        this.score = 200;
    } else if (color === 'orange') {
        this.sprite = 'images/Gem Orange.png';
        this.score = 300;
    }

    this.updatePosition(row, col);
};

Gem.prototype.updatePosition = function (row, col) {    
    this.x = col * CELL_WIDTH + CELL_WIDTH * 0.2;
    this.y = row * CELL_HEIGHT + CELL_HEIGHT * 0.5;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 80);
};

Gem.prototype.checkCollision = function(player) {
    if ((this.x > player.x) && (this.x < (player.x + CELL_WIDTH))) {
        if ((this.y > player.y) && (this.y < (player.y + CELL_HEIGHT))) {
            return true;
        }
    }
    return false;
};

// For holding objects of the game like enemies, gems and player
// Another important role of this class is for state of game
// When the game is in different state, show different information on canvas
var Game = function () {
    //State of game could be: new, playing, win, over, fail
    this.lifeImage = 'images/Heart.png';
    this.charSelector = 'images/Selector.png';
    this.state = 'new';
    this.level = 1;
    this.numLife = 3;
    this.score = 0;
    this.time = 0;
    this.allEnemies = [];
    for (var i = 0; i < 3; i++) {
        this.allEnemies.push(new Enemy());
    }
    this.player = new Player();
    this.addGems();
};

Game.prototype.addGems = function () {
    this.gems = [];

    var gemColors = ['green', 'blue', 'orange'];

    // Generate unique positions for gems on canvas
    var positions = [];
    while (positions.length<3) {
        var newPos = {x: getRandomIntInclusive(1, 3), y: getRandomIntInclusive(0, 4)};
        var occupied = false;
        for (var i=0; i<positions.length; i++) {
            if ((positions[i].x === newPos.x) && (positions[i].y === newPos.y)) {
                occupied = true;
                break;
            }
        }
        if (!occupied) {
            positions.push(newPos);
        }
    }

    //Create gem objects
    for (var i=0; i<gemColors.length; i++) {
        this.gems.push(new Gem(gemColors[i], positions[i].x, positions[i].y));
    }
};

Game.prototype.render = function () {
    //Draw number of life on screen
    for (var i=0; i<this.numLife; i++) {
        ctx.drawImage(Resources.get(this.lifeImage), 10 + i * 30, 50, 30, 50);
    }

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';

    // Display elapsed time
    ctx.textAlign = 'right';
    ctx.font = '20pt Impact';
    ctx.fillText(this.time.toFixed(1).toString() + 's', 4.9 * CELL_WIDTH, 1.4 * CELL_HEIGHT);
    ctx.strokeText(this.time.toFixed(1).toString() + 's', 4.9 * CELL_WIDTH, 1.4 * CELL_HEIGHT);

    // Display game level
    ctx.textAlign = 'center';
    ctx.fillText('Level ' + this.level.toString(), 2.5 * CELL_WIDTH, 1 * CELL_HEIGHT);
    ctx.strokeText('Level ' + this.level.toString(), 2.5 * CELL_WIDTH, 1 * CELL_HEIGHT);

    //Display score
    ctx.textAlign = 'right';
    ctx.fillText(this.score.toString(), 4.9 * CELL_WIDTH, 1 * CELL_HEIGHT);
    ctx.strokeText(this.score.toString(), 4.9 * CELL_WIDTH, 1 * CELL_HEIGHT);

    //Draw the screen for starting a new game
    if (this.state === 'new') {
        ctx.drawImage(Resources.get(this.charSelector), 2 * CELL_WIDTH, 5 * CELL_HEIGHT);

        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('Press space to play', 2.5 * CELL_WIDTH, 3 * CELL_HEIGHT);
        ctx.strokeText('Press space to play', 2.5 * CELL_WIDTH, 3 * CELL_HEIGHT);
        ctx.font='30pt Impact';
        ctx.fillText('Select character', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.strokeText('Select character', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.fillText('<', 1.8 * CELL_WIDTH, 6.5 * CELL_HEIGHT);
        ctx.strokeText('<', 1.8 * CELL_WIDTH, 6.5 * CELL_HEIGHT);
        ctx.fillText('>', 3.2 * CELL_WIDTH, 6.5 * CELL_HEIGHT);
        ctx.strokeText('>', 3.2 * CELL_WIDTH, 6.5 * CELL_HEIGHT);
    }

    if (this.state === 'playing') {
        
    }

    if (this.state === 'win') {
        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('You made it!', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.strokeText('You made it!', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.textAlign = 'center';
        ctx.font = '30pt Impact';
        ctx.fillText('Press space for next level', 2.5 * CELL_WIDTH, 6 * CELL_HEIGHT);
        ctx.strokeText('Press space for next level', 2.5 * CELL_WIDTH, 6 * CELL_HEIGHT);
    }

    if (this.state === 'fail') {
        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('Busted!', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.strokeText('Busted!', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.textAlign = 'center';
        ctx.font = '30pt Impact';
        ctx.fillText('Press space to continue', 2.5 * CELL_WIDTH, 6 * CELL_HEIGHT);
        ctx.strokeText('Press space to continue', 2.5 * CELL_WIDTH, 6 * CELL_HEIGHT);
    }

    if (this.state === 'over') {
        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('Game Over', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.strokeText('Game Over', 2.5 * CELL_WIDTH, 5 * CELL_HEIGHT);
        ctx.textAlign = 'center';
        ctx.font = '30pt Impact';
        ctx.fillText('Press space to restart', 2.5 * CELL_WIDTH, 6 * CELL_HEIGHT);
        ctx.strokeText('Press space to restart', 2.5 * CELL_WIDTH, 6 * CELL_HEIGHT);
    }
};

Game.prototype.update = function(dt) {
    if (this.state === 'playing') {
        this.time += dt;
    }
};

// Now instantiate the game object
// All other objects like enemies, player and gems are initialized when the game object is initialized
// And the other objects are attached to the game object

var game = new Game();

// This listens for key presses and handle key pressing events according to different game state
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var key = allowedKeys[e.keyCode];

    // When game state is new, press left/right is for selecting game characters
    // Pressing space bar to start the game. Then the game state will be changed to 'playing'
    if (game.state === 'new') {
        switch (key) {
            case 'space':
                game.state = 'playing';
                break;
            case 'left':
            case 'right':
                game.player.changeChar(key);
                break;
        }        
    }

    // When game state is playing, only left/right/up/down key pressing events are handled to move player
    if (game.state === 'playing') {
        switch (key) {
            case 'left': 
                game.player.moveLeft();
                break;
            case 'right':
                game.player.moveRight();
                break;
            case 'up':
                // If player reached river, change game state to 'win'. Pause moving of enemies
                game.player.moveUp();
                if (game.player.row === 0) {
                    game.state = 'win';
                    game.allEnemies.forEach(function (enemy) {
                        enemy.speed = 0;
                    });
                }
                break;
            case 'down':
                game.player.moveDown();
                break;
        }
    } 
    
    // When game state is win, the only allowed key pressing event is space
    // All the enemies are not moving. Player cannot be moved.
    // When space is pressed, level up the game and increase speed of enemies
    if (game.state === 'win') {
        if (key === 'space') {
            game.state = 'playing';
            game.level++;       //level up

            // Reset player to original position
            game.player.row = 5;
            game.player.col = 2;

            // Increase speed of enemies
            game.allEnemies.forEach(function (enemy) {
                enemy.level = game.level;
                enemy.speed = getRandomIntInclusive(100 + 50 * enemy.level, 300 + 50 * enemy.level);
            });

            // Add new set of gems on canvas
            game.addGems();
        }
    }

    if (game.state === 'fail') {
        if (key === 'space') {
            game.state = 'playing';  // Retry
            game.player.row = 5;
            game.player.col = 2;

            // Start moving the enemies again. Overall speed is not increased.
            game.allEnemies.forEach(function (enemy) {
                enemy.level = game.level;
                enemy.speed = getRandomIntInclusive(100 + 50 * enemy.level, 300 + 50 * enemy.level);
            });
            game.addGems();     // Add new set of gems on canvas
        }
    }

    // Game is over. Press space to reset the game. Reset almost everything.
    if (game.state === 'over') {
        if (key === 'space') {
            game.state = 'new';
            game.level = 1;
            game.numLife = 3;
            game.time = 0;
            game.score = 0;
            game.player.row = 5;
            game.player.col = 2;
            game.allEnemies.forEach(function (enemy) {
                enemy.level = game.level;
                enemy.speed = getRandomIntInclusive(100 + 50 * enemy.level, 300 + 50 * enemy.level);
            });
            game.addGems();
        }
    }
});
