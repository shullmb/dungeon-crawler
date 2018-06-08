// ***CANVAS SETUP*** //
var dungeon = document.getElementById('dungeon'); //rename canvas id dungeon when implemented
var battleScreen = document.getElementById('battle-screen')
var darkness = document.getElementById('darkness');
var ctxD = dungeon.getContext('2d');
var ctxB = battleScreen.getContext('2d');
var lantern = darkness.getContext('2d');

var ctxWidth = 832;
var ctxHeight = 416;

dungeon.width = ctxWidth;
dungeon.height = ctxHeight;
battleScreen.width = ctxWidth;
battleScreen.height = ctxHeight;
darkness.width = ctxWidth;
darkness.height = ctxHeight;


// ***GLOBAL VARIABLES*** //
var gameLoopHandle;
var crawlerAttackHandle;
var dungeonMode = true;
var battleMode = false;
var gameOver = false;

var player;
var crawlers = [];
var crawler = {current: null, index: null};



var playerTurn = false;

// ***UI DOM HOOKS*** //
var topRight = document.getElementById('top-right');
var btmRight = document.getElementById('btm-right');
var topLeft = document.getElementById('top-left');
var topMid = document.getElementById('top-mid');
var btmLeft = document.getElementById('btm-left');
var level = document.getElementById('level');
var spells = document.getElementById('spells');
var heals = document.getElementById('heals');
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

// update player stats
var updateStats = function() {
    level.textContent = player.level;
    spells.textContent = player.spellSlots;
    heals.textContent = player.healSlots;
    hitPoints.textContent = player.hp;
    rollValue.textContent = '';

}

// updates btm-left to show player roll
var updateRollValue = function(value) {
    rollValue.textContent = value;
}

// updates btm-right to display message
var updateMsgBoard = function(msg) {
    msgBoard.textContent = msg;
}

// whirly fun when rolling
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

// animation used during planned delay in gameplay
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
                player.src = "../img/plc-mage-32-u.png";
                player.y -= 5;
                break;
            case (e.keyCode === 83 || e.keyCode === 40):
                player.src = "../img/plc-mage-32-d.png";
                player.y += 5;
                break;
            case (e.keyCode === 65 || e.keyCode === 37):
                player.src = "../img/plc-mage-32-l.png";
                player.x -= 5;
                break;
            case (e.keyCode === 68 || e.keyCode === 39):
                player.src = "../img/plc-mage-32-r.png";
                player.x += 5;
                break;
        }
    }
}

// input Handler battle mode -- playerAttack repeated to avoid 'undefined'
var battleInputHandler = function(e) {
    if (battleMode && playerTurn) {
        var atk;
        switch(true) {
            case (e.keyCode === 48):
                if (player.healSlots > 0) {
                    playerHeal();
                    updateMsgBoard("You feel stronger...");
                } else {
                    updateMsgBoard("Out of heals! Hit 'em hard!");
                }
                break;
            case (e.keyCode === 49):
                
                atk = player.rollCantrip();
                playerAttack(atk);
                break;
            case (e.keyCode === 50):
                if ( player.spellSlots > 0 ) {
                    atk = player.rollAttack(10);
                    playerAttack(atk);
                    player.spellSlots--;
                } else {
                    updateMsgBoard('Not enough spell power!');
                }
                break;
            case (e.keyCode === 51):
                if ( player.spellSlots >= 2 ) {
                    atk = player.rollAttack(10);
                    playerAttack(atk);
                    player.spellSlots-=2;
                } else {
                    updateMsgBoard('Not enough spell power!');
                }
                break;
            case(e.keyCode === 75): //kill the crawler
                atk = 100 * player.rollAttack(100);
                playerAttack(atk);
                break;
            default:
                updateMsgBoard('Press 1,2, or 3 key to attack');
        }
    }

}

// smash that return key and return to the dungeon of doom
var gameOverInputHandler = function(e) {
    if (gameOver) {
        if (e.keyCode === 13) {
            restartGame();
        }
    }
}

// ***CANVAS HELPERS*** //

// shroud of darkness -- help from stack overflow https://stackoverflow.com/questions/6271419/how-to-fill-the-opposite-shape-on-canvas
var drawGloom = function() {
    lantern.clearRect(0, 0, ctxWidth, ctxHeight);
    lantern.fillStyle = 'rgba(255,255,255,0)'; // 
    lantern.fillRect(0, 0, ctxWidth, ctxHeight);
    
    // create canvas for mask here -- doesn't seem to work declared externally from thsi function
    var light = document.createElement('canvas');
    light.width = ctxWidth;
    light.height = ctxHeight;
    var gloom = light.getContext('2d');

    // punch out for lantern effect
    gloom.fillStyle = "rgba(0,0,0,1)";
    gloom.fillRect(0, 0, ctxWidth, ctxHeight);
    gloom.globalCompositeOperation = 'destination-out';
    gloom.filter = "blur(32px)";
    
    var lanternRadius = 48 + Math.floor(Math.random() * 16); //causing artifacts
    // var lanternRadius = 64;

    // position lantern centered over player
    gloom.arc(player.x + 16, player.y + 16, lanternRadius, 0, 2 * Math.PI);
    gloom.fill();

    lantern.drawImage(light, 0, 0);
}

// battle background
var drawBattleScreen = function() {
    ctxB.clearRect(0, 0, battleScreen.width, battleScreen.height);
    ctxB.fillStyle = 'rgba(66,66,66,0.8)';
    ctxB.strokeRect(10, 10, 812, 396);
    ctxB.fillRect(10, 10, 812, 396);
}

// render hero + crawler large
var drawBattleParticipants = function() {
    var pImg = new Image();
    var cImg = new Image();
    pImg.src = player.srcLrg;
    cImg.src = crawler.current.srcLrg;

    ctxB.drawImage(pImg, 50, 50, 64, 64);
    ctxB.drawImage(cImg, battleScreen.width - 50 - 64, 50, 64, 64);
}

// render message to a canvas
var drawBattleHeader = function(ctx, text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "26px 'Press Start 2P'";
    ctx.fillText(text, x, y);
}

// display spell choices

var drawAttackChoices = function() {
    var spellOne = new Image();
    var spellTwo = new Image();
    var spellThree = new Image();
    var spellFour = new Image();

    spellOne.src = "../img/throw_icicle_new_128.png";
    spellTwo.src = "../img/fireball_new_128.png";
    spellThree.src = "../img/death_channel_128.png";
    spellFour.src = "../img/cure_poison_new_128.png";

    ctxB.drawImage(spellOne, 70, 200, 128, 128);
    ctxB.drawImage(spellTwo, 258, 200, 128, 128);
    ctxB.drawImage(spellThree, 258 + 128 + 60, 200, 128, 128);
    ctxB.drawImage(spellFour, 258 +128+60+128+60, 200, 128, 128);

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
}

// create hero prototype 
function Hero (x,y,src) {
    Crawler.call(this, x, y, src);
    this.hp = 15 + Math.round(Math.random() * 5);
    this.spellSlots = 3;
    this.healSlots = 1;
}

Hero.prototype = Object.create(Crawler.prototype);
Hero.prototype.constructor = Hero;

// cantrip roll - player level x d8
Hero.prototype.rollCantrip = function() {
    return this.level * rollDie(8)
}

// hero extras on the level up
Hero.prototype.levelUp = function() {
    Crawler.prototype.levelUp.call(this);
    this.spellSlots += Math.round(this.level / 2);
    this.healSlots++;
}

// func to generate crawlers
var generateCrawlers = function(limitLessTwo) {
    // generate 3 - 6 crawlers
    var numCrawlers = 2 + Math.ceil(Math.random() * limitLessTwo);
    var crawlerSprites = ["../img/plc-shroom-32.png", "../img/plc-deathooze-32.png", "../img/plc-eye-32.png", "../img/plc-snail-32.png"]
    for (var i = 0; i < numCrawlers; i++) {
        // random coordinates 
        var x = Math.floor(Math.random() * ctxWidth);
        var y = Math.floor(Math.random() * ctxHeight);
        
        // pad for hero starting position and dungeon boundaries        
        if ( x < 64 && y < 64) {
            x = (x < 64) ? x + 64 : x;
            y = (y < 64) ? y + 64 : y;
        }
        x = ( x > ctxWidth - 32 ) ? x - 64 : x;
        y = ( y > ctxHeight - 32 ) ? y - 64 : y;
        
        // random sprite from array
        var randomSprite = crawlerSprites[Math.floor(Math.random() * crawlerSprites.length)];
        // instantiate random crawler
        var randomCrawler = new Crawler(x, y, randomSprite);

        crawlers.push(randomCrawler);
    }
}

// ***GAME PLAY & LOGIC*** //
var initGame = function() {
    gameOver = false;
    player = new Hero(0, 0, '../img/plc-mage-32-r.png');
    generateCrawlers(player.level);
    hitPoints.textContent = player.hp;   
}

var endGame = function(status) {
    gameOver = true;
    var statusScreen = new Image(832,416);
    if (status === 'win') {
        statusScreen.src = "../img/winscreen.png";
    } else {
        statusScreen.src = "../img/gameover.png";
    }
    ctxB.drawImage(statusScreen,0,0);
    animateMsgBoard('Press return to play again');
}

var restartGame = function() {
    player = null;
    dungeonMode = true;
    battleMode = false;
    crawlers.length = 0;
    destroyCrawler();
    ctxD.clearRect(0,0,ctxWidth,ctxHeight);
    ctxB.clearRect(0,0,ctxWidth,ctxHeight);
    updateMsgBoard();
    initGame();
    gameLoopHandle = setLoopInterval();
}

var startDungeonMode = function() {
    ctxD.clearRect(0, 0, ctxWidth, ctxHeight);
    drawGloom();
    player.render(ctxD);
    crawlers.forEach( function(crawler) {
        crawler.render(ctxD);
    })
    detectEncounter();
}

var returnToDungeon = function() {
    ctxB.clearRect(0,0,battleScreen.width, battleScreen.height);
    ctxD.restore();
    updateRollValue('');
    updateMsgBoard('');
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
                drawBattleHeader(ctxB, "CRAWLER ENCOUNTERED", 190, 50, 'red');
        }
    })}
    // console.log(crawler.current);
}

var startBattleMode = function() {
    console.log('battlemode initiated');
    var turnMsg;
    updateMsgBoard('ROLL FOR INITIATIVE!');
    player.rollInitiative();
    crawler.current.rollInitiative();
    whoseTurn();
    turnMsg = !playerTurn ? 'Crawler hits first' : 'You attack first'
    animateRoll(player.initiative);
    setTimeout( function() {
        animateMsgBoard("Crawler rolled " + crawler.current.initiative);
    },500)
    setTimeout( function() {
        drawBattleScreen();
        drawBattleParticipants();
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
    console.log('crawler', atk);
    updateMsgBoard("You've been hit for " + atk);
    playerTurn = true;
    updateStats();
    setTimeout(battleHandler,1500);
}

var playerAttack = function(atk) {
    animateRoll(atk);
    crawler.current.hp -= atk;
    updateMsgBoard("Crawler is hit for " + atk);
    playerTurn = false;
    if (crawler.current.hp > 0 && crawler.current !== null) {
        setTimeout( function() {
            crawlerAttack();
        }, 2000);
    } else {
        battleHandler();
    }
}

var playerHeal = function() {
    var healRoll = player.level * (2 * rollDie(4)) + 2;
    animateRoll(healRoll);
    player.hp+= healRoll;
    player.healSlots--;
    playerTurn = false;
    setTimeout(crawlerAttack,2000);
}

var destroyCrawler = function () {
    crawler.current = null;
    crawler.index = null;
}

var checkForWin = function() {
    if (crawlers.length === 0) {
        endGame('win');
    } else {
        setTimeout(returnToDungeon, 1000);
    }
}

var battleHandler = function() {
    if (player.hp > 0 && crawler.current.hp > 0) {
        if (!playerTurn) {
            setTimeout(crawlerAttack, 2000); // DEBUG THIS
        } else {
            drawAttackChoices();
            updateMsgBoard('Choose your attack!');
        }
    } else if (crawler.current.hp <= 0 && crawlers.length >= 1) {
        player.levelUp();
        // clear crawler from crawlers arr and crawler object
        crawlers.splice(crawler.index, 1);
        destroyCrawler();
        // check for win and restart dungeon mode if crawlers left
        checkForWin();
        // returnToDungeon();
    } else if (player.hp <= 0) {
        endGame();
        console.log('you lose')
    }
    updateStats();
}


// *** READY *** //
document.addEventListener('DOMContentLoaded', function(){
    initGame();
    document.addEventListener('keydown', movementInputHandler);
    document.addEventListener('keydown', battleInputHandler);
    document.addEventListener('keydown', gameOverInputHandler);
    
    

    gameLoopHandle = setLoopInterval();
})

