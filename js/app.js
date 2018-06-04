// game setup
const game = document.getElementById('game');
const ctx = game.getContext('2d');
game.width = "832";
game.height = "416";

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
        // trigger encounter screen
    }
}

const keyInputHandler = (e) => {
    switch(true) {
        case (e.keyCode === 87 || e.keyCode === 38):
            mage.y -= 5;
            break;
        case (e.keyCode === 83 || e.keyCode === 40):
            mage.y += 5;
            break;
        case (e.keyCode === 65 || e.keyCode === 37):
            mage.x -= 5;
            break;
        case (e.keyCode === 68 || e.keyCode === 39):
            mage.x += 5;
            break;
    }
}

// function for game loop
const gameLoop = () => {
    ctx.clearRect(0,0,game.width,game.height);
    mage.render();
    mush.render();
    detectEncounter();
}


document.addEventListener("DOMContentLoaded", function() {
    console.log('craaaawwwwwwl');

    mage = new Crawler(10, 10,'../img/plc-mage-32.png');
    mush = new Crawler(200, 50,'../img/wandering_mushroom_new.png');

    setInterval(gameLoop, 60);

    document.addEventListener('keydown', keyInputHandler);





})