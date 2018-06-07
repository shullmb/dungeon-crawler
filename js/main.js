// ***CANVAS SETUP*** //
var dungeon = document.getElementById('dungeon'); //rename canvas id dungeon when implemented
var battleScreen = document.getElementById('battle-screen')
var ctx = dungeon.getContext('2d');
var ctx2 = dungeon.getContext('2d');
var ctxWidth = '832';
var ctxHeight = '416';

dungeon.width = ctxWidth;
dungeon.height = ctxHeight;
battleScreen.width = ctxWidth;
battleScreen.height = ctxHeight;

// ***GLOBAL VARIABLES*** //
var gameLoopHandle;
var dungeonMode = true;
var battleMode = false;

var player;
var crawlers = [];
var crawler = {current: null, index: null};

var playerTurn = null;

// ***UI DOM HOOKS*** //
var topRight = document.getElementById('top-right');
var btmRight = document.getElementById('btm-right');
var topLeft = document.getElementById('top-left');
var btmLeft = document.getElementById('btm-left');
var hitPoints = document.getElementById('hit-points');
var rollValue = document.getElementById('roll-value');
var msgBoard = document.getElementById('message-board');

// ***HELPER FUNCTIONS*** //

// game loop with exit strategy
var setLoopInterval = function() {
    return setInterval( function() {
        if (dungeonMode) {
            startDungeonMode();
        } else {
            clearInterval(gameLoopHandle);
            startBattleMode(crawler.current);
        }
    },60)
}

// roll a die of n sides
var rollDie = function(n) {
    return Math.ceil(Math.random() * n);
}

// check if it is the player's turn
var whoseTurn = function() {
    if (player.initiative >= crawler.current.initiative) {
          playerTurn = true;
    }
}

// input handler in dungeon mode
var movementInputHandler = function(e) {
    // disallow movement when battle screen is active
    if (dungeonMode) {
        switch (true) {
            case (e.keyCode === 87 || e.keyCode === 38):
                player.y -= 10;
                break;
            case (e.keyCode === 83 || e.keyCode === 40):
                player.y += 10;
                break;
            case (e.keyCode === 65 || e.keyCode === 37):
                player.x -= 10;
                break;
            case (e.keyCode === 68 || e.keyCode === 39):
                player.x += 10;
                break;
        }
    }
}

// input Handler battle mode
var battleInputHandler = function(e) {
    if (battleMode) {
        switch(true) {
            case (e.keyCode === 49):
                console.log('cantrip')
                break;
            case (e.keyCode === 50):
                console.log('med attack')
                break;
            case (e.keyCode === 51):
                console.log('big attack')
                break;
        }
    }

}


// ***CRAWLER PROTOTYPE & GENERATOR*** //
function Crawler(x, y, src) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.srcLrg = src.replace('32', '64');
    this.width = 32;
    this.height = 32;
    this.level = 1;
    this.initiative = 0;
    this.hp = 8 + Math.round(Math.random() * 3); // randomize starting hp a little
    this.spellSlots = 3;
    this.initiative = 0;
}

// render to a canvas
Crawler.prototype.render = function(ctx) {
    var spriteImg = new Image();
    spriteImg.src = this.src;
    ctx.drawImage(spriteImg, this.x, this.y, this.width, this.height);
}

// roll for initiatice
Crawler.prototype.rollInitiative = function() {
    this.initiative = rollDie(20);
}


// attack roll - player level x d'n'
Crawler.prototype.rollAttack = function(n) {
    return this.level * rollDie(n);
}

// level up
Crawler.prototype.levelUp = function() {
    this.level += 1
    this.hp += this.level * rollDie(8) + 4;
    this.spellSlots += Math.round(this.level / 2);
}

function Hero (x,y,src) {
    Crawler.call(this, x, y, src);
    
}

Hero.prototype = Object.create(Crawler.prototype);
Hero.prototype.constructor = Hero;

// cantrip roll - player level x d8
Hero.prototype.rollCantrip = function() {
    return this.level * rollDie(8)
}

// func to generate crawlers
var generateCrawlers = function() {
    // generate 3 - 6 crawlers
    var numCrawlers = 2 + Math.ceil(Math.random() * 4);
    var crawlerSprites = ["../img/plc-shroom-32.png", "../img/plc-deathooze-32.png", "../img/plc-eye-32.png", "../img/plc-snail-32.png"]
    for (var i = 0; i < numCrawlers; i++) {
        // random coordinates -- add/substract 32 to account for player start pos
        var randomX = 32 + Math.floor(Math.random() * parseInt(ctxWidth) - 32);
        var randomY = 32 + Math.floor(Math.random() * parseInt(ctxHeight) - 32);

        // random sprite from array
        var randomSprite = crawlerSprites[Math.floor(Math.random() * crawlerSprites.length)];
        // instantiate random crawler
        var randomCrawler = new Crawler(randomX, randomY, randomSprite);

        crawlers.push(randomCrawler);
    }
}

// ***GAME PLAY & LOGIC*** //
var initGame = function() {
    player = new Hero(0, 0, '../img/plc-mage-32.png');
    generateCrawlers();
    hitPoints.textContent = player.hp;   
}

var startDungeonMode = function() {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);
    player.render(ctx);
    crawlers.forEach( function(crawler) {
        crawler.render(ctx);
    })
    detectEncounter();
}

var detectEncounter = function() {
    crawlers.forEach( function(crwlr,i){
        if ( player.x < crwlr.x + crwlr.width
            && player.x + player.width > crwlr.x
            && player.y < crwlr.y + crwlr.height
            && player.y + player.height > crwlr.y) {
                console.log('they touchin!')
                ctx.save();
                crawler.current = crwlr;
                crawler.index = i;
                dungeonMode = false;
                battleMode = true;
        }
    })
    // console.log(crawler.current);
}

var startBattleMode = function() {
    console.log('battlemode initiated');
    msgBoard.textContent = 'ROLL FOR INITIATIVE!';
    rollValue.textContent = "."
    setTimeout( function() {
        rollValue.textContent = ".."
    },250);
    setTimeout( function() {
        rollValue.textContent = "..."
    },500);
    player.rollInitiative();
    crawler.current.rollInitiative();
    setTimeout( function() {
        rollValue.textContent = player.initiative;
    },1500);
    whoseTurn();
    setTimeout( function() {
        msgBoard.textContent = "Crawler rolled a " + crawler.current.initiative;
    },2000)
    // !playerTurn ? crawlerAttack() : playerAttack();

}

var crawlerAttack = function() {
    var atk;
    var atkSelection = rollDie(20);
    if (atkSelection >= 0 && atkSelection < 14) {
        atk = crawler.current.rollAttack(4);
    } else if (atkSelection >= 14 && atkSelection > 20) {
        atk = crawler.current.rollAttack(6);
    } else {
        atk = crawler.current.rollAttack(10)
    }
    player.hp -= atk;
    msgBoard.textContent = "You've been hit for " + atk;
    hitPoints.textContent = player.hp;
}

var playerAttack = function() {
    var atk;
    // if input == 49
        // cantrip
    // if input == 50
        // med atk
    // if input == 51
        // big atk

}

var battleHandler = function() {
    if (player.hp > 0 && crawler.current.hp > 0) {
        // battle
    } else if (crawler.current.hp <= 0) {
        // clear crawler from crawlers arr and crawler object
        crawlers.splice(crawler.index, 1);
        crawler.current = null;
        crawler.index = null;

        // restart dungeon mode

    } else {
        // gameOver();
        // initGame();
    }
}


// *** READY *** //
document.addEventListener('DOMContentLoaded', function(){
    initGame();
    document.addEventListener('keydown', movementInputHandler);
    document.addEventListener('keydown', battleInputHandler);



    gameLoopHandle = setLoopInterval();
})

