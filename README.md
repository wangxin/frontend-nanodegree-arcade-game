# Frontend nanodegree arcade game

This is a project for the frontend nanodegree arcade game.

## How to run the game

## Prerequisite

* HTTP server

HTTP server is required to serve the files.

* Browser

This game must be run in browser.

### Setup http server

Any HTTP server should be OK to serve the files of this game. In this example, http server of python3 is used as an example. Assume the files are stored under folder 'arcade-game'.

```
# cd arcade-game
# python -m http.server
```

### Run the game

* Open browser like Chrome.
* Input URL: http://localhost:8000/index.html

## How to play the game

* Before staring the game, press "left" or "right" button can select character of player.
* Press space to start playing.
* Press the arrow keys can move the player around.
* You target is move the player so that it can accross the rock land and reach the river.
* While the player is on the rock land, try to avoid the bugs. If the player collide a bug, game will fail.
* For each game, you have 3 chances to fail. The number of hearts displayed on the upper left corner is the number of chances you got.
* If you used up all your 3 changes, game will over. Press space can restart a new game.
* There are gems on the rock land that the player can collect to score. 
  * Green = 100 scores
  * Blue = 200 scores
  * Orange = 300 scores
