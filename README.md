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
mockup screen shots

![Wireframe!](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/wireframe.png)

Turn Based game

![Gameplay](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/gameplay.gif)

## The Game Loop - 2 modes
damage on repeat
## Scrapping the draft

## Rewrite with scale in mind
rewrite

## A dark place... and a light to guide
adding an element of suspense

masking the canvas

![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/lantern1.png)

adding a feathered effect

![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/lantern2.png)

```js
gloom.filter = "blur(32px)";
```


Getting the feel right

![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/flicker.gif)

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

