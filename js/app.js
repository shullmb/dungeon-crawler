// ***CANVAS SETUP*** //
var dungeon = document.getElementById('dungeon'); //rename canvas id dungeon when implemented
var battleScreen = document.getElementById('battle-screen')
var ctxD = dungeon.getContext('2d');
var ctxB = battleScreen.getContext('2d');
var ctxWidth = 832;
var ctxHeight = 416;

dungeon.width = ctxWidth;
dungeon.height = ctxHeight;
battleScreen.width = ctxWidth;
battleScreen.height = ctxHeight;

// ***GLOBAL VARIABLES*** //
var gameLoopHandle;
var dungeonMode = true;
var battleMode = false;
var gameOver = false;

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

var updateRollValue = function(value) {
    rollValue.textContent = value;
}

var updateMsgBoard = function(msg) {
    msgBoard.textContent = msg;
}

var animateRoll = function(roll) {
    setTimeout(function () {
        updateRollValue(".");
    }, 100);
    setTimeout(function () {
        updateRollValue("-");
    }, 200);
    setTimeout(function () {
        updateRollValue("--");
    }, 300);
    setTimeout(function () {
        updateRollValue("\\");
    }, 400);
    setTimeout(function () {
        updateRollValue("|");
    }, 500);
    setTimeout(function () {
        updateRollValue("/");
    }, 600);
    setTimeout(function () {
        updateRollValue("--");
    }, 700);
    setTimeout(function () {
        updateRollValue("\\");
    }, 800);
    setTimeout(function () {
        updateRollValue("|");
    }, 900);
    setTimeout(function () {
        updateRollValue("/");
    }, 1000);
    setTimeout(function () {
        updateRollValue("--");
    }, 1100);
    setTimeout(function () {
        updateRollValue(roll);
    }, 1200);
}

var animateMsgBoard = function(msg) {
    updateMsgBoard(".");
    setTimeout(function () {
        updateMsgBoard("..");
    }, 250);
    setTimeout(function () {
        updateMsgBoard("...");
    }, 500);
    setTimeout(function () {
        updateMsgBoard(".");
    }, 750);
    setTimeout(function () {
        updateMsgBoard("..");
    }, 1000);
    setTimeout(function () {
        updateMsgBoard("...");
    }, 1100);
    setTimeout(function () {
        updateMsgBoard(msg);
    }, 1200);
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
    if (battleMode && playerTurn) {
        var atk;
        switch(true) {
            case (e.keyCode === 49):
                console.log('cantrip')
                atk = player.rollCantrip();
                break;
            case (e.keyCode === 50):
                console.log('med attack')
                atk = player.rollAttack(10);
                break;
            case (e.keyCode === 51):
                console.log('big attack')
                atk = player.rollAttack(12);
                break;
            case(e.keyCode === 75): //kill the crawler
                crawler.current.hp = 0;
                break;
        }
        playerAttack(atk);
        setTimeout(crawlerAttack, 2000);
    }

}

// ***CANVAS HELPERS*** //

var drawBattleScreen = function() {
    // background
    ctxB.clearRect(0, 0, battleScreen.width, battleScreen.height);
    ctxB.fillStyle = 'rgba(66,66,66,0.8)';
    ctxB.strokeRect(10, 10, 812, 396);
    ctxB.fillRect(10, 10, 812, 396);
    
    // render hero + crawler large
    var pImg = new Image();
    var cImg = new Image();
    pImg.src = player.srcLrg;
    cImg.src = crawler.current.srcLrg;

    ctxB.drawImage(pImg, 50, 50, 64, 64);
    ctxB.drawImage(cImg, battleScreen.width - 50 - 64, 50, 64, 64);
}

var drawBattleHeader = function(ctx, text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "26px 'Press Start 2P'";
    ctx.fillText(text, x, y);
}


// ***CRAWLER, HERO PROTOTYPE & GENERATOR*** //
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

// create hero prototype 
function Hero (x,y,src) {
    Crawler.call(this, x, y, src);
    this.hp = 15 + Math.round(Math.random() * 5);
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
        // random coordinates 
        var randomX = Math.floor(Math.random() * parseInt(ctxWidth));
        var randomY = Math.floor(Math.random() * parseInt(ctxHeight));

        // pad for hero starting position and dungeon boundaries
        randomX = randomX < 64 ? randomX + 64 : randomX;
        randomX = randomX > parseInt(ctxWidth) ? randomX - 64 : randomX;
        randomY = randomY < 64 ? randomY + 64 : randomY;
        randomY = randomY > parseInt(ctxHeight) ? randomY - 64 : randomY;


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

var endGame = function(status) {
    // status == win => show victory screen
    // status == lose => show game over screen
    // press return to start new game
}

var startDungeonMode = function() {
    ctxD.clearRect(0, 0, ctxWidth, ctxHeight);
    player.render(ctxD);
    crawlers.forEach( function(crawler) {
        crawler.render(ctxD);
    })
    detectEncounter();
}

var returnToDungeon = function() {
    ctxB.clearRect(0,0,battleScreen.width, battleScreen.height);
    ctxD.restore();
    dungeonMode = true;
    gameLoopHandle = setLoopInterval();
}

var detectEncounter = function() {
    if (dungeonMode) {
    crawlers.forEach( function(crwlr,i){
        if ( player.x < crwlr.x + crwlr.width
            && player.x + player.width > crwlr.x
            && player.y < crwlr.y + crwlr.height
            && player.y + player.height > crwlr.y) {
                console.log('they touchin!')
                ctxD.save();
                crawler.current = crwlr;
                crawler.index = i;
                dungeonMode = false;
                battleMode = true;
                drawBattleHeader(ctxB, "CRAWLER ENCOUNTERED", 190, 50, 'white');
        }
    })}
    // console.log(crawler.current);
}

var startBattleMode = function() {
    console.log('battlemode initiated');
    var turnMsg;
    msgBoard.textContent = 'ROLL FOR INITIATIVE!';
    player.rollInitiative();
    crawler.current.rollInitiative();
    whoseTurn();
    turnMsg = !playerTurn ? 'Crawler hits first' : 'You attack first'
    animateRoll(player.initiative);
    animateMsgBoard("Crawler rolled " + crawler.current.initiative);
    setTimeout( function() {
        drawBattleScreen();
        updateRollValue('');
        updateMsgBoard(turnMsg);
        drawBattleHeader(ctxB, "FIGHT!", 330, 50,'red');
        setTimeout(battleHandler, 1000);
    }, 2200)

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
    animateMsgBoard("You've been hit for " + atk);
    hitPoints.textContent = player.hp;

    playerTurn = true;
    battleHandler();
}

var playerAttack = function(atk) {
    crawler.current.hp -= atk;

    animateMsgBoard("Crawler is hit for " + atk);
    playerTurn = false;
    battleHandler();
}

var destroyCrawler = function() {
    crawlers.splice(crawler.index, 1);
    crawler.current = null;
    crawler.index = null;
}

var battleHandler = function() {
    if (player.hp > 0 && crawler.current.hp > 0) {
        if (!playerTurn) {
            setTimeout(crawlerAttack, 2000); // DEBUG THIS
        }

    } else if (crawler.current.hp <= 0) {
        // clear crawler from crawlers arr and crawler object
        destroyCrawler();
        // restart dungeon mode
        returnToDungeon();

        player.levelUp();
    } else {
        // gameOver = true;
        if (crawlers.length == 0) {
            // endGame(win);
        } else {
            // endGame(lose);
        }
    }
}


// *** READY *** //
document.addEventListener('DOMContentLoaded', function(){
    initGame();
    document.addEventListener('keydown', movementInputHandler);
    document.addEventListener('keydown', battleInputHandler);



    gameLoopHandle = setLoopInterval();
})

