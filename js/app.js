// game setup
const game = document.getElementById('game');
const battleScreen = document.getElementById('battle-screen');
const ctx = game.getContext('2d');
const ctx2 = battleScreen.getContext('2d');
const canvasWidth = '832';
const canvasHeight = '416';

game.width = canvasWidth;
game.height = canvasHeight;
battleScreen.width = canvasWidth;
battleScreen.height = canvasHeight;

var loopHandle;
var dungeonLoopRunning = true;
var battleLoopRunning = false;

// DOM hooks
const topRight = document.getElementById('top-right');
const btmRight = document.getElementById('btm-right');

// declare crawlers
var mage;
var mush;

// helper functions

// roll die
const roll = (numSides) => {
    return Math.floor(Math.random() * numSides);
}

// create Crawler object to populate dungeon
class Crawler {
    constructor(x,y,src) {
        this.x = x;
        this.y = y;
        this.src = src;
        // add larger image properties for battle screen
        this.width = 32;
        this.height = 32;
        this.level = 1;
        // randomize starting hp a little
        this.hp = 8 + Math.round(Math.random() * 3);
    }

    // ctx argument to choose context to render to
    render(ctx) {
        let spriteImg = new Image();
        spriteImg.src = this.src;
        ctx.drawImage(spriteImg,this.x,this.y,this.width,this.height);
    }

    // attack roll
    rollAttack(numDice, numSides) {
        return numDice * roll(numSides);
    }

    // level up
    levelUp(){
        this.level += 1
        this.hp += this.level * roll(8) + 4;
    }


}

// function to detect contact with monster -- hard coding in mushroom placeholder for development
const detectEncounter = () => {
    if (mage.x < mush.x + mush.width
        && mage.x + mage.width > mush.x
        && mage.y < mush.y + mush.height
        && mage.y + mage.height > mush.y) {
        console.log('Prepare for BATTTLE!')
        // trigger encounter screen as soon as i know how
        ctx.save();
        dungeonLoopRunning = false;
    }
}

// function for keypress in dungeon roaming mode
const movementInputHandler = (e) => {
    // console.log(e.keyCode);
    // disallow movement when battle screen is active
    if (dungeonLoopRunning) {
        switch(true) {
            case (e.keyCode === 87 || e.keyCode === 38):
                mage.y -= 10;
                break;
            case (e.keyCode === 83 || e.keyCode === 40):
                mage.y += 10;
                break;
            case (e.keyCode === 65 || e.keyCode === 37):
                mage.x -= 10;
                break;
            case (e.keyCode === 68 || e.keyCode === 39):
                mage.x += 10;
                break;
        }
    }
}

// function for keypress in battle mode
const battleInputHandler = (e) => {
    if (battleLoopRunning) {
        switch(e.keyCode) {
            case 49:
                console.log('keypressed')
                break;
            case 50:
                console.log('keypressed')
                break;
            case 51:
                console.log('keypressed')
                break;

        }
    }
}

// function for dungeoneering loop
const dungeonLoop = () => { 
    ctx.clearRect(0,0,game.width,game.height);
    mage.render(ctx);
    // track info during development/debug -- using innerHTML temporarily
    topRight.innerHTML = "<h3>x:" + mage.x + "<br>y:" + mage.y + "</h3>";
    // draw mush if still alive
    if (mush.hp > 0) {
        mush.render(ctx) 
    } else {
        // I feel like there has to be a better way to do this
        mush.x = null;
        mush.y = null;
        mush.width = 0;
        mush.height = 0;
    }
    detectEncounter();
}

// utility function to test game state on restart
const restart = () => {
    ctx2.clearRect(0,0,battle.width,battle.height);
    ctx.restore();
    battleLoopRunning = false;
    dungeonLoopRunning = true;
}

// draw battle screen stage
const drawBattleScreen = () => {
    ctx2.clearRect(0,0,battle.width,battle.height);
    ctx2.fillStyle = 'rgba(66,66,66,0.8)';
    ctx2.strokeRect(10,10,812,396);
    ctx2.fillRect(10,10,812,396);
    
}

const drawParticipants = (crawler) => {
    // create image objects and assign src -- create Crawler method to return these
    let playerImg = new Image();
    playerImg.src = mage.src;
    let crawlerImg = new Image();
    crawlerImg.src = crawler.src;

    // render on battle screen
    ctx2.drawImage(playerImg, 50,50, 64, 64);
    ctx2.drawImage(crawlerImg, battle.width - 50 - 64, 50, 64, 64);
}

function drawBattleHeader(ctx, text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "26px 'Press Start 2P'";
    ctx.fillText(text, x, y);
}


// function to receive player input
const chooseAction = (crawler) => {
    // logic goes here
    // kill opponent in development -- this fires repeatedly
    document.addEventListener('keypress', function(e) {
        if (e.keyCode === 13 ) {
            let atk = mage.rollAttack(mage.level, 8);
            console.log(atk);
            return crawler.hp -= atk;
        }
    })
}

const startBattle = (crawler) => {
    battleLoopRunning = true;
    drawBattleScreen();
    drawBattleHeader(ctx2, 'ROLL FOR INITIATIVE',165,50, '#000');
    drawParticipants(crawler);
    battle(crawler);
}

const battle = (crawler) => {
    btmRight.innerHTML = "<h3>p: " + mage.hp + "  m: " + mush.hp + "</h3>";

    chooseAction(crawler);
    if (mush.hp <= 0) {
        restart();
    }
}

document.addEventListener("DOMContentLoaded", function() {

    // create crawlers
    mage = new Crawler(10, 10,'../img/plc-mage-32.png');
    mush = new Crawler(200, 50,'../img/wandering_mushroom_new.png');

    // set up event listener for movement keypress
    document.addEventListener('keydown', movementInputHandler);
    document.addEventListener('keydown', battleInputHandler);
    
    // start game loop
    loopHandle = setInterval( function() {
        if (dungeonLoopRunning == true) {
            dungeonLoop();
        } else {
            startBattle(mush);
        }
    }, 60);
    





})