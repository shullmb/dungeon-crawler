// game setup
const game = document.getElementById('game');
const ctx = game.getContext('2d');
var loopHandle;
var dungeonLoopRunning = true;
game.width = "832";
game.height = "416";

// DOM hooks
const topRight = document.getElementById('top-right');

//globals
var mage;
var mush;

// create Crawler object to populate dungeon
class Crawler {
    constructor(x,y,src) {
        this.x = x;
        this.y = y;
        this.src = src;
        this.width = 32;
        this.height = 32;
        this.alive = true;
    }

    render() {
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
        mush.alive = false; 
        ctx.save();
        dungeonLoopRunning = false;
    }
}

const keyInputHandler = (e) => {
    // console.log(e.keyCode);
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
        // restart loop test
        case (e.keyCode === 49):
            restart();
            break;
    }
}

// function for dungeoneering loop
const dungeonLoop = () => { 
    detectEncounter();
    ctx.clearRect(0,0,game.width,game.height);
    mage.render();
    // track position during development/debug -- using innerHTML temporarily
    topRight.innerHTML = "<h3>x:" + mage.x + " y:" + mage.y + "</h3>";
    if (mush.alive) {
        mush.render() 
    } else {
        // I feel like there has to be a better way to do this
        mush.x = null;
        mush.y = null;
    }
}

// utility function to test game state on restart
const restart = () => {
    ctx.restore();
    dungeonLoopRunning = true;
}


document.addEventListener("DOMContentLoaded", function() {

    // create crawlers
    mage = new Crawler(10, 10,'../img/plc-mage-32.png');
    mush = new Crawler(200, 50,'../img/wandering_mushroom_new.png');

    // set up event listener for keyepress
    document.addEventListener('keydown', keyInputHandler);
    
    // start game loop
    loopHandle = setInterval( function() {
        if (dungeonLoopRunning == true) {
            dungeonLoop();
        } 
    }, 60);
    





})