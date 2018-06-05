// import * as Crawler from 'crawler.js'; // why doesn't this work??

// game setup
const game = document.getElementById('game');
const battle = document.getElementById('battle');
const ctx = game.getContext('2d');
const ctx2 = battle.getContext('2d');
const canvasWidth = '832';
const canvasHeight = '416';

game.width = canvasWidth;
game.height = canvasHeight;
battle.width = canvasWidth;
battle.height = canvasHeight;

var loopHandle;
var dungeonLoopRunning = true;

// DOM hooks
const topRight = document.getElementById('top-right');

// declare crawlers
var mage;
var mush;

// create Crawler object to populate dungeon
class Crawler {
    constructor(x,y,src) {
        this.x = x;
        this.y = y;
        this.src = src;
        // add larger image properties for battle screen
        this.width = 32;
        this.height = 32;
        this.alive = true;
    }

    // ctx argument to choose context to render to
    render(ctx) {
        let spriteImg = new Image();
        spriteImg.src = this.src;
        ctx.drawImage(spriteImg,this.x,this.y,this.width,this.height);
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

// function for dungeoneering loop
const dungeonLoop = () => { 
    ctx.clearRect(0,0,game.width,game.height);
    mage.render(ctx);
    // track position during development/debug -- using innerHTML temporarily
    topRight.innerHTML = "<h3>x:" + mage.x + "<br>y:" + mage.y + "</h3>";
    
    // draw mush if still alive
    if (mush.alive) {
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
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillText(text, x, y);
}


// function to receive player input
const chooseAction = (crawler) => {
    // logic goes here

    // kill opponent in development
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 13 ) {
            crawler.alive = false;
        }
    })
}

const startBattle = (crawler) => {
    drawBattleScreen();
    drawBattleHeader(ctx2, 'ROLL FOR INITIATIVE',130,50, '#000');
    drawParticipants(crawler);
    chooseAction(crawler);

}

document.addEventListener("DOMContentLoaded", function() {

    // create crawlers
    mage = new Crawler(10, 10,'../img/plc-mage-32.png');
    mush = new Crawler(200, 50,'../img/wandering_mushroom_new.png');

    // set up event listener for movement keypress
    document.addEventListener('keydown', movementInputHandler);
    document.addEventListener('keydown', function(e){
        if (e.keyCode === 49) {
            restart();
        }
    });
    
    // start game loop
    loopHandle = setInterval( function() {
        if (dungeonLoopRunning == true) {
            dungeonLoop();
        } else {
            startBattle(mush);
        }
    }, 60);
    





})