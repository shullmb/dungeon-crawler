// game setup
const game = document.getElementById('game');
const battleScreen = document.getElementById('battle-screen');
const ctx = game.getContext('2d');
const ctx2 = battleScreen.getContext('2d');
const canvasWidth = '832';
const canvasHeight = '416';

var isItRunning = 0

game.width = canvasWidth;
game.height = canvasHeight;
battleScreen.width = canvasWidth;
battleScreen.height = canvasHeight;

var loopHandle;
var dungeonLoopRunning = true;
var battleLoopRunning = false;
var turn = 1;

// DOM hooks
const topRight = document.getElementById('top-right');
const btmRight = document.getElementById('btm-right');

// declare crawlers
var mage;
var mush;

// helper functions

// super complicated game loop logic
const setLoopInterval = function() {
    return setInterval(function () {
        if (dungeonLoopRunning) {
            dungeonLoop()
        } else {
            clearInterval(loopHandle);
            startBattle(mush);
            // console.log(isItRunning);
            // isItRunning++;
        }
    }, 60);
}

// roll die
const roll = (numSides) => {
    return Math.ceil(Math.random() * (numSides));
}

// draw battle screen stage
const drawBattleScreen = () => {
    ctx2.clearRect(0, 0, battleScreen.width, battleScreen.height);
    ctx2.fillStyle = 'rgba(66,66,66,0.8)';
    ctx2.strokeRect(10, 10, 812, 396);
    ctx2.fillRect(10, 10, 812, 396);

}

// draw participants on battle screen
const drawParticipants = (crawler) => {
    // create image objects and assign src -- create Crawler method to return these
    let playerImg = new Image();
    playerImg.src = mage.src;
    let crawlerImg = new Image();
    crawlerImg.src = crawler.src;

    // render on battle screen
    ctx2.drawImage(playerImg, 50, 50, 64, 64);
    ctx2.drawImage(crawlerImg, battleScreen.width - 50 - 64, 50, 64, 64);
}

//draw message on header of battle screen
function drawBattleHeader(ctx, text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "26px 'Press Start 2P'";
    ctx.fillText(text, x, y);
}

// function for keypress in battle mode
const battleInputHandler = (e) => {
//     if (battleLoopRunning) {
//         switch(e.keyCode) {
//             case 49:
//                 return 
//                 break;
//             case 50:
                
//                 break;
//             case 51:
                
//                 break;

//         }
//     }
}

// function for keypress in dungeon roaming mode
const movementInputHandler = (e) => {
    // console.log(e.keyCode);
    // disallow movement when battle screen is active
    if (dungeonLoopRunning) {
        switch (true) {
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
        this.initiative = 0;
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
        battleLoopRunning = true;
    }
}

// utility function to test game state on restart
const restart = () => {
    ctx2.clearRect(0,0,battleScreen.width,battleScreen.height);
    ctx.restore();
    battleLoopRunning = false;
    dungeonLoopRunning = true;
    loopHandle = setLoopInterval();
}

const startBattle = (crawler) => {
    drawBattleScreen();
    drawBattleHeader(ctx2, 'ROLL FOR INITIATIVE',165,50, '#000');
    drawParticipants(crawler);
    console.log(turn,1)
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 49){
            // console.log(turn,2)
            battle(crawler);
        } else {
        }
    })
}

const battle = (crawler) => {
    // console.log(turn,3);
    if (crawler.hp > 0 && mage.hp > 0 ){
        if (turn%2 === 0) {
            setTimeout( function() {
                mage.hp -= 0.5 * (crawler.rollAttack(crawler.level,4));
            }, 750)
        } else {
            crawler.hp -= mage.rollAttack(1,8);
        }
        btmRight.innerHTML = "<h3>p: " + mage.hp + "  m: " + crawler.hp + "</h3>";
        turn++;
        console.log("post atk: ",turn)
    } else {
        restart();
        turn = 0;
    }
}

// ********************* DOM Stuff *********************//

document.addEventListener("DOMContentLoaded", function() {
    
    // create crawlers
    mage = new Crawler(10, 10,'../img/plc-mage-32.png');
    mush = new Crawler(200, 50,'../img/wandering_mushroom_new.png');
    
    // for dev purposes
    btmRight.innerHTML = "<h3>p: " + mage.hp + "  m: " + mush.hp + "</h3>";
    
    // set up event listener for movement keypress
    document.addEventListener('keydown', movementInputHandler);
    document.addEventListener('keydown', battleInputHandler);
    
    // start game loop  
    loopHandle = setLoopInterval();
})