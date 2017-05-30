// Const variables
var cellWidth = 101;
var cellHeight = 83;

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
    this.y = cellHeight * getRandomIntInclusive(1, 3);
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
        this.x = 0 - cellWidth;
        this.y = cellHeight * getRandomIntInclusive(1, 3);
        this.speed = getRandomIntInclusive(100 + 50 * this.level, 300 + 50 * this.level);
    }
};

Enemy.prototype.reset = function() {
    /*
    this.x = getRandomIntInclusive(0, 505);
    this.y = cellHeight * getRandomIntInclusive(1, 3);
    this.speed = getRandomIntInclusive(100, 300);
    */
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
    this.x = this.col * cellWidth;
    this.y = this.row * cellHeight;
};

Player.prototype.update = function() {
    this.x = this.col * cellWidth;
    this.y = this.row * cellHeight;
};

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

    this.x = (col % 5) * cellWidth;
    this.y = (row % 3) * cellHeight;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Game = function () {
    //State of game could be: new, playing, win, over
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
    for (var i=0; i< gemColors.length; i++) {
        this.gems.push(new Gem(gemColors[i], getRandomIntInclusive(1, 3), getRandomIntInclusive(0, 5)));
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
    ctx.fillText(this.time.toFixed(1).toString() + 's', 4.9 * cellWidth, 1.4 * cellHeight);
    ctx.strokeText(this.time.toFixed(1).toString() + 's', 4.9 * cellWidth, 1.4 * cellHeight);

    // Display game level
    ctx.textAlign = 'center';
    ctx.fillText('Level ' + this.level.toString(), 2.5 * cellWidth, 1 * cellHeight);
    ctx.strokeText('Level ' + this.level.toString(), 2.5 * cellWidth, 1 * cellHeight);

    //Display score
    ctx.textAlign = 'right';
    ctx.fillText(this.score.toString(), 4.9 * cellWidth, 1 * cellHeight);
    ctx.strokeText(this.score.toString(), 4.9 * cellWidth, 1 * cellHeight);

    //Draw the screen for starting a new game
    if (this.state === 'new') {
        ctx.drawImage(Resources.get(this.charSelector), 2 * cellWidth, 5 * cellHeight)

        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('Press space to play', 2.5 * cellWidth, 3 * cellHeight);
        ctx.strokeText('Press space to play', 2.5 * cellWidth, 3 * cellHeight);
        ctx.font='30pt Impact';
        ctx.fillText('Select character', 2.5 * cellWidth, 5 * cellHeight);
        ctx.strokeText('Select character', 2.5 * cellWidth, 5 * cellHeight);
        ctx.fillText('<', 1.8 * cellWidth, 6.5 * cellHeight);
        ctx.strokeText('<', 1.8 * cellWidth, 6.5 * cellHeight);
        ctx.fillText('>', 3.2 * cellWidth, 6.5 * cellHeight);
        ctx.strokeText('>', 3.2 * cellWidth, 6.5 * cellHeight);
    }

    if (this.state === 'playing') {
        
    }

    if (this.state === 'win') {
        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('You made it!', 2.5 * cellWidth, 5 * cellHeight);
        ctx.strokeText('You made it!', 2.5 * cellWidth, 5 * cellHeight);
        ctx.textAlign = 'center';
        ctx.font = '30pt Impact';
        ctx.fillText('Press space for next level', 2.5 * cellWidth, 6 * cellHeight);
        ctx.strokeText('Press space for next level', 2.5 * cellWidth, 6 * cellHeight);
    }

    if (this.state === 'fail') {
        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('Busted!', 2.5 * cellWidth, 5 * cellHeight);
        ctx.strokeText('Busted!', 2.5 * cellWidth, 5 * cellHeight);
        ctx.textAlign = 'center';
        ctx.font = '30pt Impact';
        ctx.fillText('Press space to continue', 2.5 * cellWidth, 6 * cellHeight);
        ctx.strokeText('Press space to continue', 2.5 * cellWidth, 6 * cellHeight);
    }

    if (this.state === 'over') {
        ctx.textAlign = 'center';
        ctx.font = '36pt Impact';
        ctx.fillText('Game Over', 2.5 * cellWidth, 5 * cellHeight);
        ctx.strokeText('Game Over', 2.5 * cellWidth, 5 * cellHeight);
        ctx.textAlign = 'center';
        ctx.font = '30pt Impact';
        ctx.fillText('Press space to restart', 2.5 * cellWidth, 6 * cellHeight);
        ctx.strokeText('Press space to restart', 2.5 * cellWidth, 6 * cellHeight);
    }
};

Game.prototype.update = function(dt) {
    if (this.state === 'playing') {
        this.time += dt;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var key = allowedKeys[e.keyCode];

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

    if (game.state === 'playing') {
        switch (key) {
            case 'left': 
                game.player.moveLeft();
                break;
            case 'right':
                game.player.moveRight();
                break;
            case 'up':
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
    
    if (game.state === 'win') {
        if (key === 'space') {
            game.state = 'playing';
            game.level++;
            game.player.row = 5;
            game.player.col = 2;
            game.allEnemies.forEach(function (enemy) {
                enemy.level = game.level;
                enemy.speed = getRandomIntInclusive(100 + 50 * enemy.level, 300 + 50 * enemy.level);
            });
        }
    }

    if (game.state === 'fail') {
        if (key === 'space') {
            game.state = 'playing'
            game.player.row = 5;
            game.player.col = 2;
            game.allEnemies.forEach(function (enemy) {
                enemy.level = game.level;
                enemy.speed = getRandomIntInclusive(100 + 50 * enemy.level, 300 + 50 * enemy.level);
            });
        }
    }

    if (game.state === 'over') {
        if (key === 'space') {
            game.state = 'new';
            game.level = 1;
            game.numLife = 3;
            game.time = 0;
            game.player.row = 5;
            game.player.col = 2;
            game.allEnemies.forEach(function (enemy) {
                enemy.level = game.level;
                enemy.speed = getRandomIntInclusive(100 + 50 * enemy.level, 300 + 50 * enemy.level);
            });
        }
    }

});
