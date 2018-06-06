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
var crawler = {current: null};
var turn = null;

// ***UI DOM HOOKS*** //

var topRight = document.getElementById('top-right');
var btmRight = document.getElementById('btm-right');
var topLeft = document.getElementById('top-left');
var btmLeft = document.getElementById('btm-left');
var hitPoints = document.getElementById('hit-points');

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
function rollDie(n) {
    return Math.ceil(Math.random() * n);
}

// movement input handler in dungeon mode
movementInputHandler = function(e) {
    console.log(e.keyCode);
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


// ***CRAWLER PROTOTYPE*** //
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
}

// render to a canvas
Crawler.prototype.render = function(ctx) {
    var spriteImg = new Image();
    spriteImg.src = this.src;
    ctx.drawImage(spriteImg, this.x, this.y, this.width, this.height);
}

// cantrip roll - player level x d8
Crawler.prototype.rollCantrip = function() {
    return this.level * roll(8)
}

// attack roll - player level x d'n'
Crawler.prototype.rollAttack = function(n) {
    return this.level * roll(n);
}

// level up
Crawler.prototype.levelUp = function() {
    this.level += 1
    this.hp += this.level * roll(8) + 4;
    this.spellSlots += Math.round(this.level / 2);
}


// ***GAME LOGIC*** //

var startDungeonMode = function() {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);
    player.render(ctx);

}

// *** READY *** //
document.addEventListener('DOMContentLoaded', function(){
    player = new Crawler(10,10,'../img/plc-mage-32.png');

    document.addEventListener('keypdown', movementInputHandler);


    gameLoopHandle = setLoopInterval();
})