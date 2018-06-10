# Dungeon of DOOM

## Roam the deep and battle it out with dwellers of the dark places.

# How to play

## Objective

## Game Controls
#### Crawling through the Dungeon
Players make their way through the darkness encountering horrors from the deep

 Keypress | Action 
:--------:|--------
 ⬆️| move player up
 ⬇️️| move player down
 ⬅️| move player 
 ➡️| move player up

#### Battling it out
 Keypress | Action | Damage | Cost 
:--------:|--------|:------:|:----:
 1️⃣| Ice Blast |Player Level * d8| 
 ️2️⃣| Fireball |Player Level * d10| 1 spell pt
 3️⃣| Death Channel |Player Level * 2d8| 2 spell pt
 0️⃣| Heal yourself |Player Level * (2d4 + 2)| 1 heal pt

___

# Development

## Idea & Wireframes

After an hour of introduction to HTML5 Canvas using jQuery at the end of class on a Friday, I went home and decided to recreate the exercise using vanilla JavaScript (ES6) and started thinking about what I wanted to do for the [project](https://gawdiseattle.gitbooks.io/wdi/11-projects/project-1/readme.html) that I was going to be starting the next week. 

<!-- ![Canvas Proof of concept](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/proofofconcept.gif) -->
![Canvas Proof of concept](../readme_screenshots/dc/mockup/proofofconcept.gif)



![Wireframe!](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/wireframe.png)

Turn Based game

![Gameplay](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/gameplay.gif)


## The Game Loop - 2 modes
damage on repeat
## Scrapping the draft


## Rewrite with scale in mind
rewrite in ES5
practice with prototypal inheritance
ruby background and comfort with class syntax, getters/setters, etc 

## A dark place... and a light to guide
adding an element of suspense

#### Masking the canvas

![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/lantern1.png)

```js
var canvasMask = new Image();
canvasMask.src = "img/canvas_mask.png";
gloom.drawImage(canvasMask,0,0,ctxWidth,ctxHeight);
gloom.globalCompositeOperation = 'destination-out';
```

#### Feathering the edges


![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/lantern2.png)

This is still labeled as [experimental](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) on MDN and at the time of writing only works in Chrome.
```js
gloom.filter = "blur(32px)";
```


#### Getting the feel right

After adding the filter, it still didn't have the feel I was hoping to achieve. So I began to think about what was missing and identified the static nature of the glow... So I began experimenting. As the main game loop function is firing every 60ms, I was able to easily calculate a random number for my `lanternRadius` at this interval. This produced an excellent flicker that added the final piece I was looking for.

![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/flicker.gif)

I played with the range and settled on a number between 48 and 64 pixels allowing the player to see in a radius between 16 and 32 pixels outside the size of their sprite.
```js
// flicker and fade!
var lanternRadius = 48 + Math.floor(Math.random() * 16);

// position lantern centered over player
gloom.arc(player.x + 16, player.y + 16, lanternRadius, 0, 2 * Math.PI);
gloom.fill();
```

## Shadow Imp on the hunt
.hunt()

![Imp on the hunt](https://github.com/shullmb/readme_screenshots/raw/master/dc/imp_hunt.gif)

___
## In the works
- [x] Ability to pause
- [x] Audio
- [ ] **Mute button**
- [ ] More responsive leyout
- [ ] Mobile controls
- [ ] Change the system so that leveling up occurs after the dungeon is cleared
- [ ] Scoring system
- [ ] Use Local Storage to save highscores or player's current stats
- [ ] Rats!! 🐀
- [ ] Procedurally generated dungeon walls and obstacles
- [ ] `imp.hunt()` using Dijkstra's Hero Tracking algorithm 👹
___
## Game Art & Sounds

