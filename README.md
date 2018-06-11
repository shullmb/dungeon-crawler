# Dungeon of DOOM

## Roam the deep and battle it out with dwellers of the dark places.
___
## How to play
### Game Controls
#### Crawling through the Dungeon
Players make their way through the darkness encountering horrors from the deep. Clear the dungeon of crawlers, and you may just find your way out!

 Keypress | Action 
:--------:|--------
 ⬆️ or `w`| move player up
 ⬇️️ or `s`| move player down
 ⬅️ or `a`| move player left
 ➡️ or `d`| move player right

#### Battling it out
A crawler encounter will trigger a turn based dice battle to the death.

The Player and Crawler roll to see who hits first. 

Players will be prompted to select one of the following 4 actions on their turn:

 Keypress | Action | Damage | Cost 
:--------:|--------|:------:|:----:
 1️⃣| Ice Blast |Player Level * d8| 
 ️2️⃣| Fireball |Player Level * d10| 1 spell pt
 3️⃣| Death Wave |Player Level * 2d8| 2 spell pt
 0️⃣| Heal yourself |Player Level * (2d4 + 2)| 1 heal pt

 If you are still alive when the battle is over, your stats will increase and you will return to the dungeon to seek your next opponent... Be careful, you aren't the only one hunting in the dark.
___

# Development

## Idea & Wireframes

#### Playing with canvas & styling
After an hour of introduction to HTML5 Canvas using jQuery at the end of class on a Friday, I went home and decided to recreate the exercise using vanilla JavaScript (ES6) and started thinking about what I wanted to do for the [project](https://gawdiseattle.gitbooks.io/wdi/11-projects/project-1/readme.html) that I was going to be starting (_and completing!_) the next week. 

![Canvas Proof of concept](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/proofofconcept.gif)

I decided to try my hand at building a simple dungeon crawler with turn based battle mechanics.

#### Storyboards & Wireframes with Adobe XD
I sat down with my trusty yellow legal pad and favorite blue pen and started scribbling down my ideas for how the game should work, UI ideas and battle mechanic pseudocode.

![Legal Pad Scribblings](https://github.com/shullmb/readme_screenshots/raw/master/dc/legal.jpg)

As it is part of my Creative Cloud subscription, I decided to give [Adobe XD](https://www.adobe.com/products/xd.html) a shot for wireframing and storyboarding out the flow of the game. (Apparently it is free for anyone -- cool!).

![Canvas Proof of concept](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/storyboard.png)


#### Dungeon Crawling

![Wireframe!](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/wireframe.png)

#### Turn Based Battle

![Gameplay](https://github.com/shullmb/readme_screenshots/raw/master/dc/mockup/battleMode.gif)

## Starting Development
On the Monday following the weekend planning, our class had a standup meeting to touch base and share our individual plans for the week. After receiving our instructor's blessing to go forth and start and some clarifying questions, I set out and defined tasks I hoped to complete for the first 2 days, with a goal of having a working (_minimally_) game by end-of-day Thursday. 

My goal for the first day was to be able to halt action in the dungeon, reveal the battle interface and return to the dungeon setting. 

After a morning of setting up the page, css and little more reading on canvas. I started hammering away at my app.js strictly using ES6 conventions for the practice.

By early afternoon, I had a met my goal... or so I thought.

## The Frustrating Duality of my Game Loop
Per my plan, the second day of development I started coding the turn based battle logic. 

The idea was that the player and computer controlled crawler would face off taking turns rolling dice to damage the other. 

However, as I began testing my game, something wasn't right. A single roll of an eight sided die was causing massive amounts of damage. As the example shows below.

![i got problems](https://github.com/shullmb/readme_screenshots/raw/master/dc/problems.png)

When I started logging each roll, it became obvious that the attack was happening 30 - 50 times before the logic to return to the dungeon was triggering. I was baffled -- and started looking for the cause. After some deliberation and discussion with my instructors, we identified the cause. In order to create an animation effect in canvas, one must clear and redraw the screen. In my case, I was using `setInterval()` to trigger a redraw every 60 ms so that the player appeared to run around the dungeon.


## Scrapping the draft


## Rewrite with scale in mind
rewrite in ES5
practice with prototypal inheritance
ruby background and comfort with class syntax, getters/setters, etc 

## A dark place... and a light to guide
Thrilled that the mechanics of the game were actually working as I intended (_mostly_), I turned my attention to player experience. Running around in a dungeon to collide with static creatures of known locations isn't all that fun... So I decided to turn out the lights. 

#### Masking the canvas
Earlier in the week, I had learned that I could layer canvas elements on top of each other and had already implemented this method to help execute the dual gameplay modality

![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/lantern1.png)

```js
var canvasMask = new Image();
canvasMask.src = "img/canvas_mask.png";
gloom.drawImage(canvasMask,0,0,ctxWidth,ctxHeight);
gloom.globalCompositeOperation = 'destination-out';
```

#### Feathering the edges


![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/lantern2.png)

`CanvasRenderingContext2d.filter` is still labeled as [experimental](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) on MDN and at the time of writing only works in Chrome. 
```js
gloom.filter = "blur(32px)";
```


#### Getting the feel right

After adding the filter, it still didn't quite have the feel I was hoping to achieve. So I began to think about what was missing and identified the static nature of the glow... So I began experimenting. As the main game loop function is firing every 60ms, I was able to easily calculate a random number for my `lanternRadius` at this interval. This produced an excellent flicker that added the final piece I was looking for.

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

```js
Mover.prototype.hunt = function() {
    var dx = this.x - player.x;
    var dy = this.y - player.y;
    
    if ( dx > 0) {
        this.x--; 
        this.src = this.src.replace('r','l');
    } else {
        this.x++;
        this.src = this.src.replace(/-l/,'-r');
    }
    
    if ( dy > 0 ) {
        this.y--; 
    } else {
        this.y++;
    }
}
```

![Imp on the hunt](https://github.com/shullmb/readme_screenshots/raw/master/dc/imp_hunt.gif)

___
## Known issues and shortcomings
responsiveness and lack of mobile controls

## In the works
Hoping to implement some of these soon!
- [ ] Refactoring a few things
- [x] Ability to pause
- [x] Audio
- [ ] **Mute button**
- [ ] More responsive layout
- [ ] Mobile controls
- [ ] Change the system so that leveling up occurs after the dungeon is cleared
- [ ] Hero Choice
- [ ] More crawler variety
- [ ] Scoring system
- [ ] Use Local Storage to save highscores or player's current stats
- [ ] Rats!! 🐀
- [ ] Dungeon walls, mazes and obstacles.
- [ ] `imp.hunt()` using Dijkstra's Hero Tracking algorithm 👹
___
## Game Art & Sounds
HUGE THANKS THESE FOLKS who have released their work for free use!

Hero Sprite created using the Universal LPC Spritesheet & Guarav Munjal's generator site:
https://github.com/jrconway3/Universal-LPC-spritesheet
http://gaurav.munjal.us/Universal-LPC-Spritesheet-Character-Generator

All Other sprites and floor tiles are care of the Open Game Art Archive:
http://opengameart.org and the team behind, Dungeon Crawl Stone Soup.
http://opengameart.org/content/dungeon-crawl-32x32-tiles

Soundtrack care of Juhani Junkala. These music tracks were released under CC0 creative commons license here:
https://opengameart.org/content/5-chiptunes-action

Spell Effects and Bites:
https://opengameart.org/content/rpg-sound-pack
https://opengameart.org/content/spell-sounds-starter-pack





