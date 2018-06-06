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
const topLeft = document.getElementById('top-left');
const btmLeft = document.getElementById('btm-left');

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

// draw message on header of battle screen
const drawBattleHeader = (ctx, text, x, y, color) => {
    ctx.fillStyle = color;
    ctx.font = "26px 'Press Start 2P'";
    ctx.fillText(text, x, y);
}

//clear battle text 
const clearBattleText = () => {
    ctx2.clearRect(150, 100, 200, 50);
    ctx2.fillStyle = 'rgba(66,66,66,.8)';
    ctx2.fillRect(150, 100, 200, 50);
}

// draw attack message
const drawAttackMsg = (atk) => {
    drawBattleHeader(ctx2, 'Attack', 350, 50, 'white');
    drawBattleHeader(ctx2, "Hit for " + atk, 300, 100, 'red');
}

//  draw attack choices
const drawAttackChoices = () => {
    let spellOne = new Image();
    let spellTwo = new Image();
    let spellThree = new Image();

    spellOne.src = "../img/throw_icicle_new_128.png";
    spellTwo.src = "../img/fireball_new_128.png";
    spellThree.src = "../img/death_channel_128.png";

    ctx2.drawImage(spellOne,160,200,128,128);

    ctx2.drawImage(spellTwo,348,200,128,128);

    ctx2.drawImage(spellThree,348+188,200,128,128);

}

const redrawBattleScreen = (crawler) => {
    // let msg = (currentPlayer == mage) ? "Roll Attack" : "Enemy Rolls";
    drawBattleScreen();
    drawParticipants(crawler);
}

// function for keypress in battle mode
const battleInputHandler = (e,crawler) => {
    // need to add logic re: spell slots
    if (battleLoopRunning) {
        switch(e.keyCode) {
            case 49:
                crawler.hp -= mage.rollCantrip();
                break;
            case 50:
                crawler.hp -=mage.rollAttack(8);
                mage.spellSlots -= 1
                break;
            case 51:
                crawler.hp -=mage.rollAttack(12);
                mage.spellSlots -= 2
                break;
        }
    }
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
        console.log('detectEncounter triggered');
        // trigger encounter screen as soon as i know how
        ctx.save();
        dungeonLoopRunning = false;
        battleLoopRunning = true;
        startBattle(mush);
    }
}

// utility function to test game state on restart
const restart = () => {
    ctx2.clearRect(0,0,battleScreen.width,battleScreen.height);
    ctx.restore();
    dungeonLoopRunning = true;
    loopHandle = setLoopInterval();
}

const startBattle = (crawler) => {
    drawBattleScreen();
    drawBattleHeader(ctx2, 'ROLL FOR INITIATIVE',165,50, '#000');
    drawAttackChoices();
    drawParticipants(crawler);
    document.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
            battle(crawler);
        }
    })
    
}

const battle = (crawler) => {
    var currentPlayer = (turn % 2 === 0) ? crawler : mage;
    console.log(currentPlayer, turn);
    var playerInputGiven = false;
    if (crawler.hp > 0 && mage.hp > 0 ){
        if (playerInputGiven && currentPlayer == crawler) {
            console.log(crawler);
            mage.hp -= crawler.rollCantrip()
        } else {
            document.addEventListener('keyup', function(e){
                let atk;
                if (battleLoopRunning) {
                    switch (true) {
                        case (e.keyCode === 49):
                            console.log('cantrip');
                            atk = mage.rollCantrip();
                            redrawBattleScreen(crawler);
                            drawAttackMsg(atk);
                            crawler.hp -= atk;
                            break;
                        case (e.keyCode === 50):
                            console.log('med attack')
                            atk = mage.rollAttack(8);
                            redrawBattleScreen(crawler);
                            drawAttackMsg(atk);
                            crawler.hp -= atk;
                            mage.spellSlots -= 1
                            break;
                        case (e.keyCode === 51):
                            console.log('big attack')
                            atk = mage.rollAttack(12);
                            redrawBattleScreen(crawler);
                            drawAttackMsg(atk);
                            crawler.hp -= atk;
                            mage.spellSlots -= 2
                        break;
                    }
                    playerInputGiven = true;
                }
            })
        }
        turn++;
    } else {
        battleLoopRunning = false;
        restart();
        turn = 0;
    }
}

// create Crawler object to populate dungeon
class Crawler {
    constructor(x, y, src) {
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
        this.spellSlots = 3;
    }

    // ctx argument to choose context to render to
    render(ctx) {
        let spriteImg = new Image();
        spriteImg.src = this.src;
        ctx.drawImage(spriteImg, this.x, this.y, this.width, this.height);
    }

    // cantrip roll
    rollCantrip() {
        return this.level * roll(8)
    }

    // attack roll
    rollAttack(numSides) {
        return this.level * roll(numSides);
    }

    // level up
    levelUp() {
        this.level += 1
        this.hp += this.level * roll(8) + 4;
        this.spellSlots += Math.round(this.level / 2);
    }


}

// ********************* DOM Stuff *********************//

document.addEventListener("DOMContentLoaded", function() {
    
    // create crawlers
    mage = new Crawler(10, 10,'../img/plc-mage-32.png');
    mush = new Crawler(50, 50,'../img/wandering_mushroom_new.png');
    
    // for dev purposes
    btmRight.innerHTML = "<h3>p: " + mage.hp + "  m: " + mush.hp + "</h3>";
    
    // set up event listener for movement keypress
    document.addEventListener('keydown', movementInputHandler);
    // document.addEventListener('keydown', battleInputHandler);
    
    // start game loop  
    loopHandle = setLoopInterval();
})