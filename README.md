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

 If you are still alive when the battle is over, your stats will increase and you will return to the dungeon to seek your next opponent... Be careful, you aren't the only one hunting in the dark. You can also `click` the game to pause.
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
___

## Starting Development
On the Monday following the weekend planning, our class had a standup meeting to touch base and share our individual plans for the week. After receiving our instructor's blessing to go forth and start and some clarifying questions, I set out and defined tasks I hoped to complete for the first 2 days, with a goal of having a working (_minimally_) game by end-of-day Thursday. 

My goal for the first day was to be able to halt action in the dungeon, reveal the battle interface and return to the dungeon setting. 

After a morning of setting up the page, css and little more reading on canvas. I started hammering away at my app.js strictly using ES6 conventions for the practice.

By early afternoon, I had a met my goal... or so I thought.

## The Frustrating Duality of my Game Loop
Per my plan, the second day of development I started coding the turn based battle logic. 

The idea was that the player and computer controlled crawler would face off taking turns rolling dice to damage the other. 

However, as I began testing my game, something wasn't right. The roll of an eight sided die was causing massive amounts of damage. As the example shows below, the monster, 'm', has some major health issues after a single push of a button.

![i got problems](https://github.com/shullmb/readme_screenshots/raw/master/dc/problems.png)

When I started logging each roll, it became obvious that the attack was happening 30 - 50 times before the logic to return to the dungeon was triggering. I was baffled -- and started looking for the cause. After some deliberation and discussion with my instructors, we identified the cause. In order to create an animation effect in canvas, one must clear and redraw the screen. In my case, I was using `setInterval()` to trigger a redraw every 60ms so that the player appeared to run around the dungeon.

As it turns out, my success the day before was an illusion...I had set up the interval to stop the action in the dungeon and start showing the battle interface... but it was also triggering the battle logic repeatedly until the computer controlled crawler was far past dead. 

So I went back to the drawing board and started thinking of the correct way to break in and out of the game loop.

Eventually, I came to this pattern:

- declare a global variable, `gameLoopHandle`, leaving it undefined
- create a boolean for state the game is in, `dungeonMode`
- write a function with logic that listens for an encounter that clears the interval and starts the battle, `setLoopInterval()`
- Once the DOM has loaded completely, assign `setLoopInterval()` to `gameLoopHandle`
- Once battle is done, set `dungeonMode` back to true and assign `setLoopInterval()` to `gameLoopHandle` again

Success! I had a it working -- but half a day behind my plan.

...and oh boy did I make a mess trying to debug and rework what I had already written to work with this better design.

## Scrapping the draft
Late Wednesday morning, I met with my instructor after struggling a bit to untangle my logic... and asked the question I had been avoiding. "How often have you thrown out a large chunk of your work and started again from scratch." I received the reassurance that I was looking for and decided that scrapping it was a better path to take than continuing with the current iteration. After lunch, I pulled the trigger and started reading through my code to see what I could salvage.

## Rewrite with scale in mind

Having written the first iteration in ES6, I ran into a few issues as I did not have babel and a task runner set up to in my development environment. Instead of spending time learning the right way to set up the build, I decided to write the second iteration using ES5 conventions. 

My first real experience with learning OOP was in Ruby, and ES6's new syntactic sugar for `class` had a familiarity that drew me in at the outset of this project. Rewriting in ES5 gave me a chance to practice using JavaScript's prototypal inheritance syntax with my Crawler, Hero and Mover objects. 

I was also able to take some of the patterns from the first iteration and make them more scaleable. This time around, created a function to randomly generate multiple crawlers. Further, I designed the collision detection to pick up and start battle with any of my random crawlers. By Wednesday afternoon, I had surpassed the progress of the previous two days.

## A dark place... and a light to guide
Thrilled that the mechanics of the game were actually working as I intended (_mostly_), I turned my attention to player experience. Running around in a dungeon to collide with static creatures of known locations isn't all that fun... So I decided to turn out the lights. 

#### Masking the canvas
Earlier in the week, I had learned that I could layer canvas elements on top of each other and had already implemented this method to help execute the dual gameplay states. So I started googling ways to overlay a canvas and mask a shape. I found [this answer on stack overflow](https://stackoverflow.com/questions/6271419/how-to-fill-the-opposite-shape-on-canvas) that helped set me on the right path.

Soon, I had a transparent hole in a black canvas following my hero through the dungeon.

![Lantern](https://github.com/shullmb/readme_screenshots/raw/master/dc/lantern1.png)

```js
var canvasMask = new Image();
canvasMask.src = "img/canvas_mask.png";
gloom.drawImage(canvasMask,0,0,ctxWidth,ctxHeight);
gloom.globalCompositeOperation = 'destination-out';
```

#### Feathering the edges
This was cool... but lacked the subtle glow I wanted. I started digging through MDN's info on Canvas and found the article I was looking for.

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

It was now friday afternoon, I had worked out the bugs in timing of the battle and everything seemed to be working acceptably. 

So  I started working on some of my stretch goals. I liked the idea of having a crawler that tracks the position of the player and slowly stalks closer.

I created a child of the Crawler prototype called Mover and devised the following function to start the hunt. 

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

Watch out! The imp is far stronger than the other crawlers... better get some practice with them before it finds you!

___
## Known issues and shortcomings
So far, this game is not responsive and does not have mobile controls. 

As this is my first attempt at actually using canvas, I focused on getting the gameplay and animation right first. In my initial attempts to make a responsive layout, I ran into issues with distortion of the image sprites that I was using. Resizing the window caused my 32 x 32 pixel hero and crawlers to stretch and squish in weird an unappealing ways. So I decide on a 832 x 416 pixel canvas. I am sure that there must be a way around this issue... I have not had a chance to look into it yet, but it is high on my list. 

As 832 x 416 is too big for phones, I decided to put my efforts toward creating more player experience for desktop users first before adding touch controls for tablets. 

I was able to implement some audio, however, tracking down the right sounds available for free was tricky with time in short supply, so you wont be able to hear the fireball unless you have a pretty responsive subwoofer. 


As for semantic tags in html, per the requirements, I attempted to use them where I could. I used `<main>` to hold my canvas and `<header>`, but none of the other tags seem to fit for my project. The game UI boxes don't really qualify as an aside, section, article etc, so I didn't use them.

It is deployed to mbshull.com/dungeon, however, that site does not have any links back to this repo. I will be adding a `<footer>` with information soon.

## In the works
Hoping to implement some of these soon!
- [ ] Refactoring a few things
- [ ] Modal showing controls and instructions
- [ ] More responsive layout
- [x] Ability to pause
- [x] Audio
- [ ] **Mute button**
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





